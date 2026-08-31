terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    archive = {
      source = "hashicorp/archive"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = "test"
  secret_key = "test"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3           = "http://localhost.floci.io:4566"
    iam          = "http://localhost.floci.io:4566"
    lambda       = "http://localhost.floci.io:4566"
    apigatewayv2 = "http://localhost.floci.io:4566"
  }
}

# --------------------------------------------------
# IAM Role
# --------------------------------------------------

resource "aws_iam_role" "lambda" {
  name = "my-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Service = "lambda.amazonaws.com"
      }

      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# --------------------------------------------------
# Lambda
# --------------------------------------------------

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.root}/../apps/infra/handler"
  output_path = "${path.root}/lambda.zip"
}

resource "aws_lambda_function" "handler" {
  function_name = "my-handler"

  runtime = "nodejs22.x"
  handler = "index.handler"

  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256

  role = aws_iam_role.lambda.arn
}

# --------------------------------------------------
# API Gateway HTTP API
# --------------------------------------------------

resource "aws_apigatewayv2_api" "main" {
  name          = "my-api"
  protocol_type = "HTTP"
}

# --------------------------------------------------
# Integration API Gateway → Lambda
# --------------------------------------------------

resource "aws_apigatewayv2_integration" "lambda" {
  api_id = aws_apigatewayv2_api.main.id

  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.handler.invoke_arn
  integration_method = "POST"

  payload_format_version = "2.0"
}

# --------------------------------------------------
# Route
# --------------------------------------------------

resource "aws_apigatewayv2_route" "default" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "ANY /{proxy+}"

  target = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# --------------------------------------------------
# Stage
# --------------------------------------------------

resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.main.id

  name = "dev"

  auto_deploy = true
}

# --------------------------------------------------
# Permission API Gateway → Lambda
# --------------------------------------------------

resource "aws_lambda_permission" "api_gateway" {
  statement_id = "AllowAPIGatewayInvoke"

  action = "lambda:InvokeFunction"

  function_name = aws_lambda_function.handler.function_name

  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# --------------------------------------------------
# Output
# --------------------------------------------------

output "api_url" {
  value = aws_apigatewayv2_api.main.api_endpoint
}

output "local_api_url" {
  value = "http://localhost.floci.io:4566/execute-api/${aws_apigatewayv2_api.main.id}/dev/"
}
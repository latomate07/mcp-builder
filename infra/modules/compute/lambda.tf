data "archive_file" "hello_world" {
  type        = "zip"
  source_file = "${path.root}/${var.lambda_source_file}/functions/hello_world/index.py"
  output_path = "${path.root}/${var.lambda_build_output_path}/hello_world.zip"
}

# auth_lambda imports shared modules (services/, validations/) and the
# third-party `pydantic` package, none of which a single-file archive can
# include. This assembles a full staging directory before zipping it.
resource "null_resource" "build_auth_lambda" {
  triggers = {
    index_hash       = filesha256("${path.root}/${var.lambda_source_file}/functions/auth/index.py")
    services_hash    = filesha256("${path.root}/${var.lambda_source_file}/services/CognitoIdentityProvider.py")
    validations_hash = filesha256("${path.root}/${var.lambda_source_file}/validations/CognitoUserValidation.py")
    pyproject_hash   = filesha256("${path.root}/${var.lambda_source_file}/../pyproject.toml")
    architecture     = var.lambda_architecture
  }

  provisioner "local-exec" {
    command = "${path.root}/${var.lambda_source_file}/../scripts/build_lambda.sh ${path.root}/${var.lambda_source_file} ${path.root}/${var.lambda_build_output_path}/auth_build ${var.lambda_architecture} auth pydantic"
  }
}

data "archive_file" "auth_lambda" {
  type        = "zip"
  source_dir  = "${path.root}/${var.lambda_build_output_path}/auth_build"
  output_path = "${path.root}/${var.lambda_build_output_path}/auth.zip"

  depends_on = [null_resource.build_auth_lambda]
}

resource "aws_lambda_function" "hello_world" {
  filename      = data.archive_file.hello_world.output_path
  function_name = "hello_world_lambda_function-${var.infra_environment}"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_architecture]
  code_sha256   = data.archive_file.hello_world.output_base64sha256

  environment {
    variables = {
      MCP_ENVIRONMENT = var.mcp_environment
    }
  }

  tags = {
    infra_environment = var.infra_environment
    mcp_environment   = var.mcp_environment
  }
}

resource "aws_lambda_function" "auth_lambda" {
  filename      = data.archive_file.auth_lambda.output_path
  function_name = "auth_lambda_function-${var.infra_environment}"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_architecture]
  code_sha256   = data.archive_file.auth_lambda.output_base64sha256

  environment {
    variables = {
      MCP_ENVIRONMENT           = var.mcp_environment
      COGNITO_USER_POOL_ID      = aws_cognito_user_pool.control_panel_user_pool.id
      COGNITO_APP_CLIENT_ID     = aws_cognito_user_pool_client.control_panel_client.id
      COGNITO_APP_CLIENT_SECRET = aws_cognito_user_pool_client.control_panel_client.client_secret
    }
  }

  tags = {
    infra_environment = var.infra_environment
    mcp_environment   = var.mcp_environment
  }
}

# mcp_create_lambda imports shared modules (services/, validations/) and the
# third-party `pydantic` package, none of which a single-file archive can
# include. This assembles a full staging directory before zipping it.
resource "null_resource" "build_mcp_create_lambda" {
  triggers = {
    index_hash       = filesha256("${path.root}/${var.lambda_source_file}/functions/mcp/create/index.py")
    services_hash    = filesha256("${path.root}/${var.lambda_source_file}/services/McpService.py")
    validations_hash = filesha256("${path.root}/${var.lambda_source_file}/validations/McpValidation.py")
    pyproject_hash   = filesha256("${path.root}/${var.lambda_source_file}/../pyproject.toml")
    architecture     = var.lambda_architecture
  }

  provisioner "local-exec" {
    command = "${path.root}/${var.lambda_source_file}/../scripts/build_lambda.sh ${path.root}/${var.lambda_source_file} ${path.root}/${var.lambda_build_output_path}/mcp_create_build ${var.lambda_architecture} mcp/create pydantic"
  }
}

data "archive_file" "mcp_create_lambda" {
  type        = "zip"
  source_dir  = "${path.root}/${var.lambda_build_output_path}/mcp_create_build"
  output_path = "${path.root}/${var.lambda_build_output_path}/mcp_create.zip"

  depends_on = [null_resource.build_mcp_create_lambda]
}

resource "aws_lambda_function" "mcp_create_lambda" {
  depends_on = [null_resource.build_mcp_create_lambda]

  filename      = data.archive_file.mcp_create_lambda.output_path
  function_name = "mcp_create_lambda_function-${var.infra_environment}"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_architecture]
  code_sha256   = data.archive_file.mcp_create_lambda.output_base64sha256

  environment {
    variables = {
      MCP_ENVIRONMENT           = var.mcp_environment
      MCPS_TABLE_NAME           = "mcps_${var.infra_environment}"
      MCPS_MONITORING_TABLE_NAME = "mcps_monitoring_${var.infra_environment}"
    }
  }

  tags = {
    infra_environment = var.infra_environment
    mcp_environment   = var.mcp_environment
  }
}

# mcp_read_lambda imports shared modules (services/, validations/) and the
# third-party `pydantic` package, none of which a single-file archive can
# include. This assembles a full staging directory before zipping it.
resource "null_resource" "build_mcp_read_lambda" {
  triggers = {
    index_hash       = filesha256("${path.root}/${var.lambda_source_file}/functions/mcp/read/index.py")
    services_hash    = filesha256("${path.root}/${var.lambda_source_file}/services/McpService.py")
    validations_hash = filesha256("${path.root}/${var.lambda_source_file}/validations/McpValidation.py")
    pyproject_hash   = filesha256("${path.root}/${var.lambda_source_file}/../pyproject.toml")
    architecture     = var.lambda_architecture
  }

  provisioner "local-exec" {
    command = "${path.root}/${var.lambda_source_file}/../scripts/build_lambda.sh ${path.root}/${var.lambda_source_file} ${path.root}/${var.lambda_build_output_path}/mcp_read_build ${var.lambda_architecture} mcp/read pydantic"
  }
}

data "archive_file" "mcp_read_lambda" {
  type        = "zip"
  source_dir  = "${path.root}/${var.lambda_build_output_path}/mcp_read_build"
  output_path = "${path.root}/${var.lambda_build_output_path}/mcp_read.zip"

  depends_on = [null_resource.build_mcp_read_lambda]
}

resource "aws_lambda_function" "mcp_read_lambda" {
  depends_on = [null_resource.build_mcp_read_lambda]

  filename      = data.archive_file.mcp_read_lambda.output_path
  function_name = "mcp_read_lambda_function-${var.infra_environment}"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  architectures = [var.lambda_architecture]
  code_sha256   = data.archive_file.mcp_read_lambda.output_base64sha256

  environment {
    variables = {
      MCP_ENVIRONMENT           = var.mcp_environment
      MCPS_TABLE_NAME           = "mcps_${var.infra_environment}"
      MCPS_MONITORING_TABLE_NAME = "mcps_monitoring_${var.infra_environment}"
    }
  }

  tags = {
    infra_environment = var.infra_environment
    mcp_environment   = var.mcp_environment
  }
}
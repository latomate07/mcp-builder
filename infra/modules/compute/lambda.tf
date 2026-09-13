data "archive_file" "hello_world" {
  type        = "zip"
  source_file = "${path.root}/${var.lambda_source_file}"
  output_path = "${path.root}/${var.lambda_build_output_path}"
}

resource "aws_lambda_function" "hello_world" {
  filename      = data.archive_file.hello_world.output_path
  function_name = "hello_world_lambda_function-${var.infra_environment}"
  role          = aws_iam_role.hello_world.arn
  handler       = "index.handler"
  runtime       = var.lambda_runtime
  code_sha256   = data.archive_file.hello_world.output_base64sha256

  environment {
    variables = {
      # Read by the app to pick its business credentials/endpoints (sandbox vs live).
      MCP_ENVIRONMENT = var.mcp_environment
    }
  }

  tags = {
    infra_environment = var.infra_environment
    mcp_environment   = var.mcp_environment
  }
}

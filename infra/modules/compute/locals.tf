locals {
  # Floci (local emulator) vs real AWS account — independent of mcp_environment.
  is_local_emulator = var.floci_endpoint != null

  common_tags = {
    infra_environment = var.infra_environment
    mcp_environment   = var.mcp_environment
  }

  api_routes = {
    auth = {
      path   = "/auth"
      method = "POST"
      lambda = aws_lambda_function.auth_lambda
    }

    hello_world = {
      path   = "/hello"
      method = "GET"
      lambda = aws_lambda_function.hello_world
    }
  }
}

resource "aws_cognito_user_pool" "control_panel_user_pool" {
  name = "control-panel-user-pool-${var.infra_environment}"
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  tags = local.common_tags
}

resource "aws_cognito_user" "admin_user" {
  user_pool_id = aws_cognito_user_pool.control_panel_user_pool.id
  username     = "admin"
}

resource "aws_cognito_user_pool_client" "control_panel_client" {
  name         = "control-panel-client-${var.infra_environment}"
  user_pool_id = aws_cognito_user_pool.control_panel_user_pool.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]
}

resource "aws_apigatewayv2_authorizer" "control_panel_authorizer" {
  api_id           = aws_apigatewayv2_api.http_api.id
  name             = "control-panel-authorizer"
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.control_panel_client.id]
    # Floci issuer locally, real regional Cognito endpoint on a real AWS account.
    issuer = local.is_local_emulator ? "${var.floci_endpoint}/${aws_cognito_user_pool.control_panel_user_pool.id}" : "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.control_panel_user_pool.id}"
  }
}
output "api_endpoint" {
  description = "HTTP API invoke URL"
  value       = local.is_local_emulator ? "http://${aws_apigatewayv2_api.http_api.id}.execute-api.${var.floci_endpoint_without_scheme}/${aws_apigatewayv2_stage.http_api_stage.name}" : aws_apigatewayv2_stage.http_api_stage.invoke_url
}

output "api_gateway_stage" {
  description = "Deployed stage name"
  value       = aws_apigatewayv2_stage.http_api_stage.name
}

output "hello_world_function_name" {
  description = "hello_world Lambda function name"
  value       = aws_lambda_function.hello_world.function_name
}

output "cognito_user_pool_id" {
  description = "Control panel Cognito User Pool ID"
  value       = aws_cognito_user_pool.control_panel_user_pool.id
}

output "cognito_app_client_id" {
  description = "App client ID used to obtain a JWT (e.g. via aws cognito-idp initiate-auth)"
  value       = aws_cognito_user_pool_client.control_panel_client.id
}

output "fargate_sg_id" {
  description = "Security group ID for the Fargate service that needs to access the database."
  value       = aws_security_group.fargate_sg.id
}
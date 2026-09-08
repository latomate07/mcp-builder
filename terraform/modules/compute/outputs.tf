output "api_endpoint" {
  description = "URL d'invocation de la stage HTTP API"
  value       = aws_apigatewayv2_stage.http_api_stage.invoke_url
}

output "api_gateway_stage" {
  description = "Nom de la stage déployée"
  value       = aws_apigatewayv2_stage.http_api_stage.name
}

output "hello_world_function_name" {
  description = "Nom de la fonction Lambda hello_world"
  value       = aws_lambda_function.hello_world.function_name
}

output "cognito_user_pool_id" {
  description = "ID du User Pool Cognito du control panel"
  value       = aws_cognito_user_pool.control_panel_user_pool.id
}

output "cognito_app_client_id" {
  description = "ID du client applicatif utilisé pour obtenir un JWT (ex: via aws cognito-idp initiate-auth)"
  value       = aws_cognito_user_pool_client.control_panel_client.id
}

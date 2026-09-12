output "api_endpoint" {
  value = module.compute.api_endpoint
}

output "cognito_user_pool_id" {
  description = "ID du User Pool Cognito du control panel"
  value       = module.compute.cognito_user_pool_id
}

output "cognito_app_client_id" {
  description = "ID du client applicatif utilisé pour obtenir un JWT (ex: via InitiateAuth)"
  value       = module.compute.cognito_app_client_id
}

output "cognito_auth_endpoint" {
  description = "Endpoint à POST pour s'authentifier via Cognito (InitiateAuth), ex: header X-Amz-Target = AWSCognitoIdentityProviderService.InitiateAuth"
  value       = var.floci_endpoint
}
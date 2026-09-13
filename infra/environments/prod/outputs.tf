output "api_endpoint" {
  value = module.compute.api_endpoint
}

output "cognito_user_pool_id" {
  value = module.compute.cognito_user_pool_id
}

output "cognito_app_client_id" {
  value = module.compute.cognito_app_client_id
}

output "vpc_id" {
  value = module.network.vpc_id
}

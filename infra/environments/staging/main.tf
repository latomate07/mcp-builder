module "network" {
  source = "../../modules/network"

  infra_environment = "staging"
  vpc_cidr          = "10.1.0.0/16"
}

module "compute" {
  source = "../../modules/compute"

  aws_region = var.aws_region
  # floci_endpoint / floci_endpoint_without_scheme left at their default
  # (null) -> the compute module falls back to a real Cognito/API Gateway
  # endpoint instead of the Floci URL.

  infra_environment = "staging"
  mcp_environment   = var.mcp_environment

  lambda_source_file       = "../../../apps/backend/src/functions/hello_world/index.py"
  lambda_build_output_path = "build/lambda/function.zip"
}

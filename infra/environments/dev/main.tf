module "network" {
  source = "../../modules/network"

  infra_environment = "dev"
  vpc_cidr          = "10.2.0.0/16"
}

module "compute" {
  source = "../../modules/compute"

  aws_region                    = var.aws_region
  floci_endpoint                = var.floci_endpoint
  floci_endpoint_without_scheme = var.floci_endpoint_without_scheme

  infra_environment = "dev"
  mcp_environment   = var.mcp_environment

  lambda_source_file       = "../../../apps/backend/src/functions/hello_world/index.py"
  lambda_build_output_path = "build/lambda/function.zip"
}

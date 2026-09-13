module "network" {
  source = "../../modules/network"

  infra_environment = "prod"
  vpc_cidr          = "10.0.0.0/16"
}

module "compute" {
  source = "../../modules/compute"

  aws_region = var.aws_region

  infra_environment = "prod"
  mcp_environment   = var.mcp_environment

  # path.root ici = infra/environments/prod
  lambda_source_file       = "../../../apps/backend/src/functions/hello_world/index.py"
  lambda_build_output_path = "build/lambda/function.zip"
}

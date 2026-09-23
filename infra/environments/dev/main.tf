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
  vpc_id            = module.network.vpc_id

  database_sg_id = module.database.database_sg_id

  lambda_source_file       = "../../../apps/backend/src"
  lambda_build_output_path = "build/lambda"
}

module "database" {
  source = "../../modules/database"

  aws_region        = var.aws_region
  floci_endpoint    = var.floci_endpoint
  infra_environment = "dev"
  mcp_environment   = var.mcp_environment

  fargate_sg_id = module.compute.fargate_sg_id

  vpc_id         = module.network.vpc_id
  vpc_cidr       = module.network.vpc_cidr
  vpc_subnet_ids = [module.network.public_subnet_id, module.network.private_subnet_id]
}

module "storage" {
  source = "../../modules/storage"

  floci_endpoint    = var.floci_endpoint
  infra_environment = "dev"
  mcp_environment   = var.mcp_environment
}
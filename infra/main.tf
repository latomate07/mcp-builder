locals {
  environments = {
    dev     = "10.2.0.0/16"
    staging = "10.1.0.0/16"
    prod    = "10.0.0.0/16"
  }
}

module "network" {
  source = "./modules/network"

  for_each = local.environments

  environment = each.key
  vpc_cidr    = each.value
}

module "compute" {
  source = "./modules/compute"

  aws_region = var.aws_region
  floci_endpoint_without_scheme = var.floci_endpoint_without_scheme
}

module "database" {
  source = "./modules/database"
}

module "monitoring" {
  source = "./modules/monitoring"
}
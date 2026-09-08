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
}

module "database" {
  source = "./modules/database"
}

module "monitoring" {
  source = "./modules/monitoring"
}
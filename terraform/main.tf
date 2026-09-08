module "network" {
  source = "./modules/network"
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
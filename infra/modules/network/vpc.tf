resource "aws_vpc" "this" {
  cidr_block       = var.vpc_cidr
  instance_tenancy = "default"

  tags = {
    Name              = var.infra_environment
    infra_environment = var.infra_environment
  }
}

resource "aws_vpc" "prod" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "Prod"
  }
}

resource "aws_vpc" "staging" {
  cidr_block       = "10.1.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "Staging"
  }
}

resource "aws_vpc" "dev" {
  cidr_block       = "10.2.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "Dev"
  }
}
resource "aws_subnet" "prod_public_subnet" {
  vpc_id     = aws_vpc.prod.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "Prod Public Subnet"
  }
}

resource "aws_subnet" "prod_private_subnet" {
  vpc_id     = aws_vpc.prod.id
  cidr_block = "10.0.2.0/24"

  tags = {
    Name = "Prod Private Subnet"
  }
}

resource "aws_subnet" "staging_public_subnet" {
  vpc_id     = aws_vpc.staging.id
  cidr_block = "10.1.1.0/24"

  tags = {
    Name = "Staging Public Subnet"
  }
}

resource "aws_subnet" "staging_private_subnet" {
  vpc_id     = aws_vpc.staging.id
  cidr_block = "10.1.2.0/24"

  tags = {
    Name = "Staging Private Subnet"
  }
}

resource "aws_subnet" "dev_public_subnet" {
  vpc_id     = aws_vpc.dev.id
  cidr_block = "10.2.1.0/24"

  tags = {
    Name = "Dev Public Subnet"
  }
}

resource "aws_subnet" "dev_private_subnet" {
  vpc_id     = aws_vpc.dev.id
  cidr_block = "10.2.2.0/24"

  tags = {
    Name = "Dev Private Subnet"
  }
}
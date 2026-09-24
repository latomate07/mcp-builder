resource "aws_db_parameter_group" "mcpbuilder_pg" {
  name   = "mcpbuilder-mysql8-${var.infra_environment}"
  family = "mysql8.0"
}

resource "aws_db_instance" "controlpanel_database" {
  allocated_storage      = 10
  db_name                = "controlpanel_database_${var.infra_environment}"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t3.micro"
  username               = "foo"
  password               = "foobarbaz"
  parameter_group_name   = aws_db_parameter_group.mcpbuilder_pg.name
  skip_final_snapshot    = true
  multi_az               = false
  vpc_security_group_ids = [aws_security_group.database_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.mcpbuilder_subnet_group.name

  tags = local.common_tags
}

resource "aws_db_subnet_group" "mcpbuilder_subnet_group" {
  name       = "mcpbuilder-db-subnet-group"
  subnet_ids = var.vpc_subnet_ids

  tags = local.common_tags
}

resource "aws_dynamodb_table" "mcps_table" {
  name           = "mcps_${var.infra_environment}"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_dynamodb_table" "mcps_tools_table" {
  name           = "mcps_${var.infra_environment}"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "mcp_id"

  attribute {
    name = "mcp_id"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_dynamodb_table" "mcps_monitoring_table" {
  name           = "mcps_monitoring_${var.infra_environment}"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = local.common_tags
}

resource "aws_dynamodb_table" "user_profiles" {
  name           = "user_profiles_${var.infra_environment}"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key       = "SubId" // it's the user's SubId from Cognito

  attribute {
    name = "SubId"
    type = "S"
  }

  tags = local.common_tags
}

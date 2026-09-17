resource "aws_security_group" "database_sg" {
  name        = "database-sg-${var.infra_environment}"
  description = "Security group for the database"
  vpc_id      = var.vpc_id
}

resource "aws_vpc_security_group_ingress_rule" "database_sg_ingress_mysql" {
  security_group_id            = aws_security_group.database_sg.id
  referenced_security_group_id = var.fargate_sg_id
  from_port                    = 3306
  to_port                      = 3306
  ip_protocol                  = "tcp"
}
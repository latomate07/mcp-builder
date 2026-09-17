resource "aws_security_group" "fargate_sg" {
  name        = "fargate-sg-${var.infra_environment}"
  description = "Security group for the MCP server Fargate tasks"
  vpc_id      = var.vpc_id
}

resource "aws_vpc_security_group_egress_rule" "fargate_sg_egress_mysql" {
  security_group_id            = aws_security_group.fargate_sg.id
  referenced_security_group_id = var.database_sg_id
  from_port                    = 3306
  to_port                      = 3306
  ip_protocol                  = "tcp"
}
resource "aws_ecs_cluster" "mcpbuilder_cluster" {
  name = "mcpbuilder-cluster-${var.infra_environment}"
  region = var.aws_region

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.common_tags
}

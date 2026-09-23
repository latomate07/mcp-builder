resource "aws_s3_bucket" "mcpbuilder_bucket" {
  bucket = "mcp-bucket-${var.infra_environment}"

  tags = local.common_tags
}

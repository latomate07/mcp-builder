resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  # Prefixed by infra_environment to avoid name collisions if dev/staging/prod share an account.
  name              = "/${var.infra_environment}/API-Gateway-Logs"
  log_group_class   = "STANDARD"
  retention_in_days = 7
  tags              = local.common_tags
}
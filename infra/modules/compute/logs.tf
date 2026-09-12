resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name = "API-Gateway-Logs"
  log_group_class = "STANDARD"
  retention_in_days = 7
}
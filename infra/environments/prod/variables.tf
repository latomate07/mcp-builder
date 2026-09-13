variable "aws_region" {
  description = "AWS region where resources are created"
  type        = string
  default     = "us-east-1"
}

variable "mcp_environment" {
  description = "MCP business mode for prod. Defaults to 'live'; sandbox stays a valid value in case a controlled test on prod infra is ever needed, but that's not normal usage."
  type        = string
  default     = "live"

  validation {
    condition     = contains(["sandbox", "live"], var.mcp_environment)
    error_message = "mcp_environment must be 'sandbox' or 'live'."
  }
}

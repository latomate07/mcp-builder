variable "aws_region" {
  description = "AWS region where resources are created"
  type        = string
  default     = "us-east-1"
}

variable "mcp_environment" {
  description = "MCP business mode for staging. Sandbox by default (staging usually shouldn't touch real third-party data), but can be set to 'live' for pre-prod validation."
  type        = string
  default     = "sandbox"

  validation {
    condition     = contains(["sandbox", "live"], var.mcp_environment)
    error_message = "mcp_environment must be 'sandbox' or 'live'."
  }
}

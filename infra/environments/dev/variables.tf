variable "aws_region" {
  description = "AWS region where resources are created"
  type        = string
  default     = "us-east-1"
}

variable "floci_endpoint" {
  description = "Floci endpoint (with scheme) for the local aws provider"
  type        = string
  default     = "http://localhost.floci.io:4566"
}

variable "floci_endpoint_without_scheme" {
  description = "Floci endpoint (without scheme) for the local aws provider"
  type        = string
  default     = "localhost.floci.io:4566"
}

variable "mcp_environment" {
  description = "MCP business mode for this dev instance (sandbox by default; pass 'live' to test this local dev against the real third-party API)."
  type        = string
  default     = "sandbox"

  validation {
    condition     = contains(["sandbox", "live"], var.mcp_environment)
    error_message = "mcp_environment must be 'sandbox' or 'live'."
  }
}

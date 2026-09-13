variable "infra_environment" {
  description = "Infra tier (dev, staging, prod). Determines account/VPC/state — unrelated to the MCP's business mode (sandbox/live)."
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.infra_environment)
    error_message = "infra_environment must be 'dev', 'staging' or 'prod'."
  }
}

variable "vpc_cidr" {
  description = "VPC CIDR block for this environment"
  type        = string
}

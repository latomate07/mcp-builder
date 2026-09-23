variable "infra_environment" {
  description = "Infra tier (dev, staging, prod). Not to be confused with mcp_environment."
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.infra_environment)
    error_message = "infra_environment must be 'dev', 'staging' or 'prod'."
  }
}

variable "mcp_environment" {
  description = "MCP business mode (sandbox = test third-party data/API, live = real). Independent of infra_environment: only affects runtime config (tags, Lambda env var, secret name), never resource topology."
  type        = string

  validation {
    condition     = contains(["sandbox", "live"], var.mcp_environment)
    error_message = "mcp_environment must be 'sandbox' or 'live'."
  }
}
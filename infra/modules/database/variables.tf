variable "vpc_id" {
  description = "VPC ID for the backend's Lambda functions."
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR for the backend's Lambda functions."
  type        = string
}

variable "vpc_subnet_ids" {
  description = "List of subnet IDs for the backend's Lambda functions."
  type        = list(string)
}

variable "floci_endpoint" {
  description = "Floci endpoint (with scheme) used to build the Cognito User Pool JWT issuer. Leave null outside of dev (real AWS)."
  type        = string
  default     = null
}

variable "aws_region" {
  description = "AWS region used to build the Cognito User Pool JWT issuer"
  type        = string
}

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

variable "fargate_sg_id" {
  description = "Security group ID for the Fargate service that needs to access the database."
  type        = string
}
variable "lambda_runtime" {
  description = "Lambda runtime used by the backend's Python functions"
  type        = string
  default     = "python3.12"
}

variable "lambda_architecture" {
  description = "CPU architecture for Lambda functions and their native dependencies. Floci runs Lambda containers matching the host machine's architecture rather than the declared one, so on Apple Silicon this must be arm64 to avoid a manylinux x86_64/arm64 mismatch on compiled deps like pydantic-core."
  type        = string
  default     = "arm64"
}

variable "floci_endpoint_without_scheme" {
  description = "Floci endpoint for local aws provider. Leave null outside of dev (real AWS)."
  type        = string
  default     = null
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

variable "lambda_source_file" {
  description = "Path (relative to the calling environment's path.root) to the backend's src/ directory, containing functions/, services/ and validations/."
  type        = string
}

variable "lambda_build_output_path" {
  description = "Path (relative to the calling environment's path.root) where built Lambda zips and their staging directories are written."
  type        = string
}

variable "database_sg_id" {
  description = "Security group ID for the database that needs to be accessed by the Fargate service."
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for the backend's Lambda functions."
  type        = string
}
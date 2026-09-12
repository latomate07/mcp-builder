variable "aws_region" {
  description = "AWS region where the resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "floci_endpoint" {
  description = "Floci endpoint for local aws provider"
  type        = string
  default     = "http://localhost.floci.io:4566"
}

variable "lambda_runtime" {
  description = "Runtime Lambda utilisé par les fonctions Python du backend"
  type        = string
  default     = "python3.12"
}

variable "floci_endpoint_without_scheme" {
  description = "Floci endpoint for local aws provider"
  type        = string
}

variable "floci_endpoint" {
  description = "Floci endpoint (avec scheme) utilisé pour construire l'issuer JWT du User Pool Cognito"
  type        = string
}

variable "aws_region" {
  description = "Région AWS utilisée pour construire l'issuer JWT du User Pool Cognito"
  type        = string
}
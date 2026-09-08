variable "lambda_runtime" {
  description = "Runtime Lambda utilisé par les fonctions Python du backend"
  type        = string
  default     = "python3.12"
}

variable "aws_region" {
  description = "Région AWS utilisée pour construire l'issuer JWT du User Pool Cognito"
  type        = string
}
variable "environment" {
  description = "Nom de l'environnement (dev, staging, prod...)"
  type        = string
}

variable "vpc_cidr" {
  description = "Bloc CIDR du VPC pour cet environnement"
  type        = string
}

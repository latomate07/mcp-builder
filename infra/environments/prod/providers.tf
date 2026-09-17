# TODO: prod AWS account credentials. See environments/staging/providers.tf for options.
provider "aws" {
  region = var.aws_region
}

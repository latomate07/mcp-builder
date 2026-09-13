# TODO: prod AWS account credentials (ideally a dedicated account, separate
# from staging/dev). See environments/staging/providers.tf for options.
provider "aws" {
  region = var.aws_region
}

provider "aws" {
  region     = var.aws_region
  access_key = "test"
  secret_key = "test"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true

  endpoints {
    apigatewayv2   = var.floci_endpoint
    cognitoidp     = var.floci_endpoint
    dynamodb       = var.floci_endpoint
    ec2            = var.floci_endpoint
    iam            = var.floci_endpoint
    lambda         = var.floci_endpoint
    secretsmanager = var.floci_endpoint
    s3             = var.floci_endpoint
    sns            = var.floci_endpoint
    sqs            = var.floci_endpoint
    ssm            = var.floci_endpoint
    sts            = var.floci_endpoint
  }
}

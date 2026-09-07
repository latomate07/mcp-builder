resource "aws_s3_bucket" "app" {
  bucket = "floci-terraform-example"
}

resource "aws_sqs_queue" "jobs" {
  name = "floci-terraform-jobs"
}

resource "aws_dynamodb_table" "items" {
  name         = "floci-terraform-items"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_ssm_parameter" "environment" {
  name  = "/floci/environment"
  type  = "String"
  value = "local"
}
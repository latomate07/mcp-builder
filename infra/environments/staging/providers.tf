# Real AWS account (no Floci): infra_environment = "staging" runs actual
# resources, unlike dev/.
#
# TODO: wire real credentials before the first apply, e.g. profile =
# "mcp-builder-staging", or the standard AWS_PROFILE / AWS_ACCESS_KEY_ID env
# vars, or an assume_role if going through a central account.
provider "aws" {
  region = var.aws_region
}

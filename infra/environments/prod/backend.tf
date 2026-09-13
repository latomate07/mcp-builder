# TODO before any real apply: remote backend (S3 + locking). Never keep prod
# state only on a local machine.
terraform {
  backend "local" {
    path = "state/prod.tfstate"
  }
}

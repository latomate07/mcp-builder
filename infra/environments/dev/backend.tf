# Local backend, separate from every other environment's state.
# TODO: move to a remote backend (S3 + locking) later.
terraform {
  backend "local" {
    path = "state/dev.tfstate"
  }
}

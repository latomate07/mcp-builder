# Local backend, separate from every other environment's state (guarantees
# an apply here can't touch staging/prod). Fine for a single dev on Floci;
# move to a remote backend (S3 + locking) once more than one person applies.
terraform {
  backend "local" {
    path = "state/dev.tfstate"
  }
}

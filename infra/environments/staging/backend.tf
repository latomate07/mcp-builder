# TODO before the first real apply on a shared AWS account: switch to a
# remote backend (S3 + locking). A local backend only works for one person.
#
# State is separate from dev/ and prod/ by construction — that's what
# guarantees an apply on staging can't drift into prod.
terraform {
  backend "local" {
    path = "state/staging.tfstate"
  }
}

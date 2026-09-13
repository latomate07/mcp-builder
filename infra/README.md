# Infra

## Structure

```
infra/
├── modules/           # shared building blocks (network, compute, ...)
└── environments/
    ├── dev/           # own state, runs on Floci (local AWS emulator)
    ├── staging/       # own state, real AWS account (credentials to wire up)
    └── prod/          # own state, real AWS account (credentials to wire up)
```

Each `environments/<env>/` directory is a standalone Terraform root module:
its own `backend.tf` (state), its own `providers.tf`, calling the shared
modules (`../../modules/...`) with an explicit `infra_environment` (fixed,
one per directory) and `mcp_environment` (variable, defaults to `sandbox`
except `prod` which defaults to `live`).

## Usage

```bash
cd environments/dev
terraform init
terraform apply                               # mcp_environment=sandbox by default
terraform apply -var="mcp_environment=live"   # same dev infra, live business mode
```

`staging/` and `prod/` use a real AWS provider (not Floci): see the `TODO`s
in their `providers.tf`/`backend.tf` — credentials and a remote backend (S3)
need to be wired up before the first real apply.

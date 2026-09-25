# MCP Builder

**An intuitive PaaS to create an MCP server 4x faster for AI agents** (Claude Code, Antigravity,
Cursor, Claude Desktop, Windsurf, and any other MCP-compatible client).

Point it at an OpenAPI spec or pick a template, define tools, drop in your secrets, and get a live
MCP endpoint your agents can call — without hand-writing a server, managing infrastructure, or
wiring up auth yourself.

---

## Getting started

### Run the dashboard + a local AWS emulator

```bash
docker compose up
```

This starts:

| Service | URL | What it is |
|---|---|---|
| `web` | http://localhost:3000 | The Next.js dashboard |
| `floci` | http://localhost:4566 | Local AWS API emulator |
| `floci-ui` | http://localhost:4500 | Web UI to inspect emulated AWS resources |

### Run the dashboard alone (no infra)

```bash
cd apps/web
npm install
npm run dev
```

### Try the infrastructure locally, with no AWS account

Terraform is pre-configured to talk to `floci` instead of real AWS:

```bash
docker compose up -d floci floci-ui
cd terraform
terraform init
terraform apply
```

Inspect the results at http://localhost:4500. When you're ready to target a real AWS account,
see [`docs/aws-architecture.md`](docs/aws-architecture.md) for the full design and the promotion
path from local → dev → staging → prod.

## Documentation

- [`docs/aws-architecture.md`](docs/aws-architecture.md) — full AWS architecture: control plane,
  data plane, VPC design, deployment pipeline, IAM, CI/CD, cost, and a phased build order.
- [`terraform/README.md`](terraform/README.md) — Terraform usage notes.

## Roadmap

- [ ] Control-plane API (`apps/api`) backing the dashboard's mock data
- [ ] `packages/openapi-parser`: OpenAPI → MCP tool definitions
- [ ] `packages/mcp-runtime`: the actual MCP server runtime (SSE, tool execution, auth)
- [ ] Deployment pipeline: server create/update → live Lambda-backed MCP endpoint
- [ ] Real AWS deployment (VPC, ECS, Lambda data plane) per [`docs/aws-architecture.md`](docs/aws-architecture.md)
- [ ] Self-host guide for running MCP Builder on your own AWS account

## Contributing

This project is young and the architecture is still settling — issues and PRs discussing design
before implementation are especially welcome. Open an issue to discuss what you'd like to work on.

## License

License TBD.

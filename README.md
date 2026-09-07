# MCP Builder

**An intuitive PaaS to create an MCP server 4x faster for AI agents** (Claude Code, Antigravity,
Cursor, Claude Desktop, Windsurf, and any other MCP-compatible client).

Point it at an OpenAPI spec or pick a template, define tools, drop in your secrets, and get a live
MCP endpoint your agents can call — without hand-writing a server, managing infrastructure, or
wiring up auth yourself.

> 🚧 **Status: early / pre-alpha.** The dashboard UI runs on mock data today. This is an open-source
> project, built in the open — expect things to move fast and break. See the
> [roadmap](#roadmap) below.

---

## What it does

- **Generate an MCP server from an OpenAPI spec or a template** (Stripe, GitHub, Postgres, Notion,
  and more) in minutes instead of hand-rolling one.
- **Define tools** with typed parameters, backed either by an **HTTP call** to your own API or by
  **sandboxed code** (TypeScript / Python).
- **Manage secrets** per server, injected securely at call time — never shipped to the client.
- **Expose a streaming (SSE) endpoint** with bearer tokens / API keys and optional **custom
  domains**.
- **Observe everything**: per-request logs, latency, success rate, and active-client breakdown per
  server.
- **Iterate fast**: the whole point is going from "I have an API" to "my agent can call it" far
  faster than writing and deploying an MCP server by hand — hence the name.

## Why open source

MCP Builder is built in the open, the same way Supabase is built on top of Postgres — no
proprietary black box. You can read exactly how it's deployed, run the whole stack locally against
a simulated AWS account, and deploy it to your own AWS account when you're ready. See
[`docs/aws-architecture.md`](docs/aws-architecture.md) for the full infrastructure design.

## Monorepo structure

```
apps/
  web/     # Next.js dashboard — the control-plane UI (servers, tools, secrets, logs, settings)
  api/     # Control-plane API (in progress)
  infra/   # Deployment tooling — the Lambda-based provisioning pipeline for tenant MCP servers
packages/
  mcp-runtime/       # The runtime that turns a tool config into a live MCP server
  openapi-parser/    # Turns an OpenAPI spec into MCP tool definitions
terraform/           # Infrastructure as code (see docs/aws-architecture.md)
docker/              # Runtime container image(s) for deployed MCP servers
docs/                # Architecture & design docs
```

## Tech stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI
- **Infrastructure**: AWS (Lambda, DynamoDB, S3, SQS, API Gateway, VPC, ECS Fargate, CloudFront),
  provisioned with Terraform
- **Local AWS emulation**: [`floci`](https://github.com/floci) — a LocalStack-style emulator, so you
  can develop and test infrastructure changes without an AWS account or bill

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

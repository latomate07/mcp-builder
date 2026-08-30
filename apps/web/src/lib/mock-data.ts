import { McpServer, AccountSettings, ServerTemplate, LogEntry } from "@/types/mcp";

export const INITIAL_ACCOUNT_SETTINGS: AccountSettings = {
  name: "Amir Mohammadi",
  email: "amir1375226@gmail.com",
  emailVerified: true,
  phone: "+98 935 432 9725",
  phoneVerified: false,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  twoFactorEnabled: true,
  passwordLastChanged: "12 days ago",
  plan: "Pro Developer",
  creditsBalance: 243.0,
  monthlySpend: 48.5,
  spendLimit: 200.0,
  billingEmail: "amir1375226@gmail.com",
  globalApiKeys: [
    {
      id: "key_global_1",
      name: "CI/CD Deployment Token (GitHub Actions)",
      key: "mcp_mock_token_992f8a7b3c1d4e5f6a7b8c9d0e1f2a3b",
      createdAt: "2026-07-15T10:30:00Z",
    },
    {
      id: "key_global_2",
      name: "Antigravity IDE Integration",
      key: "mcp_mock_token_447b8c9d0e1f2a3b992f8a7b3c1d4e5f",
      createdAt: "2026-08-01T14:15:00Z",
    },
  ],
};

export const INITIAL_TEMPLATES: ServerTemplate[] = [
  {
    id: "template-stripe",
    name: "Stripe Billing & Payments",
    badge: "Populaire",
    description: "Permet à vos agents de créer des clients, lister les factures, rembourser et surveiller les paiements Stripe.",
    iconName: "CreditCard",
    color: "from-blue-500/20 to-indigo-500/20 text-indigo-500",
    toolsCount: 6,
    suggestedSecrets: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
    sampleTools: [
      {
        name: "list_invoices",
        description: "Récupère les dernières factures clients avec filtre optionnel par statut et date.",
        executionMode: "http",
      },
      {
        name: "create_payment_intent",
        description: "Crée une intention de paiement sécurisée pour un montant et une devise donnés.",
        executionMode: "http",
      },
      {
        name: "refund_charge",
        description: "Effectue un remboursement partiel ou total d'un paiement Stripe.",
        executionMode: "http",
      },
    ],
  },
  {
    id: "template-github",
    name: "GitHub DevOps & PRs",
    badge: "Essentiel",
    description: "Contrôlez vos dépôts, ouvrez et fusionnez des pull requests, et gérez les issues directement depuis Claude ou Cursor.",
    iconName: "GitPullRequest",
    color: "from-purple-500/20 to-pink-500/20 text-purple-500",
    toolsCount: 5,
    suggestedSecrets: ["GITHUB_PERSONAL_ACCESS_TOKEN", "GITHUB_ORG_NAME"],
    sampleTools: [
      {
        name: "create_issue",
        description: "Crée une nouvelle issue GitHub avec titre, labels et description markdown.",
        executionMode: "http",
      },
      {
        name: "merge_pr",
        description: "Fusionne une pull request validée selon la stratégie choisie (squash/merge).",
        executionMode: "code",
      },
    ],
  },
  {
    id: "template-postgres",
    name: "PostgreSQL Data Explorer",
    badge: "Base de données",
    description: "Permet à l'IA d'inspecter les schémas de tables et d'exécuter des requêtes SELECT sécurisées en lecture seule.",
    iconName: "Database",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-500",
    toolsCount: 4,
    suggestedSecrets: ["DATABASE_URL", "PG_READ_ONLY_ROLE_PASSWORD"],
    sampleTools: [
      {
        name: "execute_read_query",
        description: "Exécute une requête SQL SELECT avec limitation automatique de résultats et protection contre les injections.",
        executionMode: "code",
      },
      {
        name: "describe_table_schema",
        description: "Retourne les colonnes, types de données, contraintes et clés étrangères d'une table.",
        executionMode: "code",
      },
    ],
  },
  {
    id: "template-notion",
    name: "Notion Knowledge Base",
    badge: "Productivité",
    description: "Donne accès à vos documents d'entreprise, specs produit et bases de connaissances Notion.",
    iconName: "BookOpen",
    color: "from-amber-500/20 to-orange-500/20 text-amber-500",
    toolsCount: 4,
    suggestedSecrets: ["NOTION_INTEGRATION_TOKEN", "NOTION_ROOT_PAGE_ID"],
    sampleTools: [
      {
        name: "search_pages",
        description: "Effectue une recherche sémantique parmi toutes les pages et bases Notion autorisées.",
        executionMode: "http",
      },
      {
        name: "create_page",
        description: "Crée une nouvelle sous-page avec titre et contenu markdown structuré.",
        executionMode: "http",
      },
    ],
  },
  {
    id: "template-slack",
    name: "Slack Ops & Notifications",
    badge: "Communication",
    description: "Permet à l'agent d'envoyer des alertes, résumés de déploiement et d'interagir dans des canaux dédiés.",
    iconName: "MessageSquare",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    toolsCount: 3,
    suggestedSecrets: ["SLACK_BOT_TOKEN", "SLACK_DEFAULT_CHANNEL_ID"],
    sampleTools: [
      {
        name: "post_message",
        description: "Envoie un message formaté en Blocks Slack dans un canal public ou privé.",
        executionMode: "http",
      },
    ],
  },
  {
    id: "template-aws-cloudwatch",
    name: "AWS CloudWatch & Logs",
    badge: "Cloud Infra",
    description: "Surveillez la santé de vos conteneurs ECS/Fargate, consultez les métriques et filtrez les flux de logs.",
    iconName: "Activity",
    color: "from-red-500/20 to-orange-500/20 text-red-500",
    toolsCount: 4,
    suggestedSecrets: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION"],
    sampleTools: [
      {
        name: "query_log_group",
        description: "Interroge un log group CloudWatch avec syntaxe CloudWatch Insights.",
        executionMode: "code",
      },
    ],
  },
];

export const INITIAL_SERVERS: McpServer[] = [
  {
    id: "stripe-ops-prod",
    name: "Stripe-Ops-Prod",
    description: "Serveur MCP connecté à l'API Stripe en production pour la gestion du billing client et des abonnements.",
    status: "active",
    sseEndpoint: "https://mcp.builder.dev/stripe-ops-prod/sse",
    region: "eu-west-3 (Paris)",
    runtime: "Node.js 20",
    vCpu: 0.5,
    memoryMb: 1024,
    createdAt: "2026-08-10T09:00:00Z",
    updatedAt: "2026-08-30T18:42:00Z",
    customDomain: "mcp-stripe.mycompany.internal",
    customDomainVerified: true,
    bearerTokens: [
      {
        id: "tok_1",
        name: "Claude Desktop Local Client",
        token: "mcp_tok_prod_89f0a21d3e4b5c6",
        createdAt: "2026-08-10T10:00:00Z",
        lastUsed: "Il y a 3 minutes",
      },
      {
        id: "tok_2",
        name: "Cursor IDE Team Token",
        token: "mcp_tok_prod_44b1c2d3e4f5a6b",
        createdAt: "2026-08-12T14:20:00Z",
        lastUsed: "Il y a 1 heure",
      },
    ],
    secrets: [
      {
        id: "sec_1",
        key: "STRIPE_SECRET_KEY",
        value: "sk_test_mock_stripe_key_abcdef1234567890",
        description: "Clé privée Stripe avec droits Restreints (Invoices & Charges)",
        updatedAt: "2026-08-10T09:12:00Z",
      },
      {
        id: "sec_2",
        key: "STRIPE_WEBHOOK_SECRET",
        value: "whsec_mock_webhook_secret_abcdef123456",
        description: "Secret de signature des webhooks Stripe",
        updatedAt: "2026-08-10T09:12:00Z",
      },
      {
        id: "sec_3",
        key: "SLACK_ALERT_WEBHOOK",
        value: "https://hooks.slack.com/services/T00/B00/XXXXX",
        description: "Webhook pour notifier les remboursements supérieurs à 500€",
        updatedAt: "2026-08-15T11:00:00Z",
      },
    ],
    metrics: {
      totalRequests24h: 38420,
      successRate: 99.6,
      avgLatencyMs: 34,
      activeClientsCount: 4,
      hourlyRequests: [
        { hour: "00h", count: 820, errorCount: 2 },
        { hour: "04h", count: 430, errorCount: 0 },
        { hour: "08h", count: 2150, errorCount: 4 },
        { hour: "12h", count: 4890, errorCount: 8 },
        { hour: "16h", count: 5410, errorCount: 12 },
        { hour: "20h", count: 3200, errorCount: 3 },
      ],
    },
    tools: [
      {
        id: "tool_1",
        name: "list_invoices",
        description: "Récupère la liste paginée des factures clients avec statut de paiement (paid, open, void).",
        isActive: true,
        category: "Billing",
        totalCalls: 18450,
        createdAt: "2026-08-10T09:30:00Z",
        updatedAt: "2026-08-25T14:10:00Z",
        params: [
          {
            name: "customer_id",
            type: "string",
            description: "ID Stripe du client (ex: cus_123abc)",
            required: false,
          },
          {
            name: "status",
            type: "string",
            description: "Statut de la facture à filtrer",
            required: false,
            enumOptions: ["paid", "open", "uncollectible", "void"],
          },
          {
            name: "limit",
            type: "number",
            description: "Nombre maximum de factures à renvoyer (1-100)",
            required: false,
            defaultValue: "10",
          },
        ],
        executionMode: "http",
        httpConfig: {
          method: "GET",
          url: "https://api.stripe.com/v1/invoices",
          authType: "bearer",
          authSecretKey: "STRIPE_SECRET_KEY",
          queryParams: [
            { key: "customer", value: "{{customer_id}}" },
            { key: "status", value: "{{status}}" },
            { key: "limit", value: "{{limit}}" },
          ],
        },
      },
      {
        id: "tool_2",
        name: "create_payment_intent",
        description: "Crée une intention de paiement sécurisée pour un montant en centimes et une devise.",
        isActive: true,
        category: "Payments",
        totalCalls: 9810,
        createdAt: "2026-08-10T10:00:00Z",
        updatedAt: "2026-08-20T11:00:00Z",
        params: [
          {
            name: "amount",
            type: "number",
            description: "Montant en plus petite unité monétaire (ex: 2000 pour 20.00 EUR)",
            required: true,
          },
          {
            name: "currency",
            type: "string",
            description: "Code devise ISO à 3 lettres (ex: eur, usd)",
            required: true,
            defaultValue: "eur",
          },
          {
            name: "customer_id",
            type: "string",
            description: "Identifiant du client Stripe rattaché",
            required: false,
          },
          {
            name: "description",
            type: "string",
            description: "Description de la transaction visible sur le relevé",
            required: false,
          },
        ],
        executionMode: "http",
        httpConfig: {
          method: "POST",
          url: "https://api.stripe.com/v1/payment_intents",
          authType: "bearer",
          authSecretKey: "STRIPE_SECRET_KEY",
          bodyTemplate: '{\n  "amount": "{{amount}}",\n  "currency": "{{currency}}",\n  "customer": "{{customer_id}}",\n  "description": "{{description}}"\n}',
        },
      },
      {
        id: "tool_3",
        name: "refund_charge",
        description: "Émet un remboursement total ou partiel d'un paiement avec motif audité.",
        isActive: true,
        category: "Payments",
        totalCalls: 1240,
        createdAt: "2026-08-11T12:00:00Z",
        updatedAt: "2026-08-22T08:30:00Z",
        params: [
          {
            name: "charge_id",
            type: "string",
            description: "ID de la charge ou du payment_intent à rembourser (ex: ch_1Nxxxx)",
            required: true,
          },
          {
            name: "amount",
            type: "number",
            description: "Montant partiel en centimes (optionnel, sinon total)",
            required: false,
          },
          {
            name: "reason",
            type: "string",
            description: "Motif du remboursement",
            required: false,
            enumOptions: ["duplicate", "fraudulent", "requested_by_customer"],
          },
        ],
        executionMode: "http",
        httpConfig: {
          method: "POST",
          url: "https://api.stripe.com/v1/refunds",
          authType: "bearer",
          authSecretKey: "STRIPE_SECRET_KEY",
          bodyTemplate: '{\n  "charge": "{{charge_id}}",\n  "amount": "{{amount}}",\n  "reason": "{{reason}}"\n}',
        },
      },
      {
        id: "tool_4",
        name: "retrieve_customer_balance",
        description: "Calcule le solde disponible, en attente et les crédits d'un client spécifique.",
        isActive: true,
        category: "Customers",
        totalCalls: 4520,
        createdAt: "2026-08-12T15:00:00Z",
        updatedAt: "2026-08-28T09:00:00Z",
        params: [
          {
            name: "customer_id",
            type: "string",
            description: "Identifiant client (ex: cus_987xyz)",
            required: true,
          },
        ],
        executionMode: "code",
        codeConfig: {
          language: "typescript",
          code: `import { McpContext } from "@mcp-builder/runtime";

export default async function handler(params: { customer_id: string }, ctx: McpContext) {
  const stripeKey = ctx.secrets.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is missing");
  
  const res = await fetch(\`https://api.stripe.com/v1/customers/\${params.customer_id}\`, {
    headers: { Authorization: \`Bearer \${stripeKey}\` }
  });
  
  const data = await res.json();
  return {
    customerId: data.id,
    balance: data.balance,
    currency: data.currency || "eur",
    delinquent: data.delinquent
  };
}`,
        },
      },
      {
        id: "tool_5",
        name: "cancel_subscription",
        description: "Annule immédiatement ou en fin de période de facturation l'abonnement d'un utilisateur.",
        isActive: true,
        category: "Subscriptions",
        totalCalls: 890,
        createdAt: "2026-08-13T10:00:00Z",
        updatedAt: "2026-08-29T16:00:00Z",
        params: [
          {
            name: "subscription_id",
            type: "string",
            description: "ID de l'abonnement Stripe (ex: sub_1Oxxxx)",
            required: true,
          },
          {
            name: "cancel_at_period_end",
            type: "boolean",
            description: "Si vrai, attend la fin du cycle pour annuler",
            required: false,
            defaultValue: "true",
          },
        ],
        executionMode: "http",
        httpConfig: {
          method: "DELETE",
          url: "https://api.stripe.com/v1/subscriptions/{{subscription_id}}",
          authType: "bearer",
          authSecretKey: "STRIPE_SECRET_KEY",
        },
      },
      {
        id: "tool_6",
        name: "calculate_mrr_metrics",
        description: "Agrège le Revenu Récurrent Mensuel (MRR) et le taux de churn sur les 30 derniers jours.",
        isActive: false,
        category: "Analytics",
        totalCalls: 310,
        createdAt: "2026-08-14T11:00:00Z",
        updatedAt: "2026-08-29T17:00:00Z",
        params: [
          {
            name: "period_days",
            type: "number",
            description: "Période en jours pour l'analyse (défaut: 30)",
            required: false,
            defaultValue: "30",
          },
        ],
        executionMode: "code",
        codeConfig: {
          language: "typescript",
          code: `export default async function handler(params: { period_days?: number }) {
  // Calcul MRR simulé
  return {
    current_mrr_eur: 42850,
    growth_rate_pct: 12.4,
    active_subscribers: 580,
    churn_rate_pct: 1.2
  };
}`,
        },
      },
    ],
  },
  {
    id: "github-assistant",
    name: "GitHub-Assistant",
    description: "Serveur MCP pour gérer les issues, pull requests et la recherche de code dans les dépôts de l'organisation.",
    status: "active",
    sseEndpoint: "https://mcp.builder.dev/github-assistant/sse",
    region: "us-east-1 (N. Virginia)",
    runtime: "Node.js 20",
    vCpu: 0.5,
    memoryMb: 1024,
    createdAt: "2026-08-15T14:00:00Z",
    updatedAt: "2026-08-30T17:00:00Z",
    bearerTokens: [
      {
        id: "tok_gh_1",
        name: "Dev Workstation",
        token: "mcp_tok_gh_77a98b1c",
        createdAt: "2026-08-15T14:00:00Z",
        lastUsed: "Il y a 20 minutes",
      },
    ],
    secrets: [
      {
        id: "sec_gh_1",
        key: "GITHUB_PAT",
        value: "ghp_mock_personal_access_token_12345",
        description: "GitHub Personal Access Token avec scopes repo & read:org",
        updatedAt: "2026-08-15T14:05:00Z",
      },
    ],
    metrics: {
      totalRequests24h: 14200,
      successRate: 99.9,
      avgLatencyMs: 28,
      activeClientsCount: 2,
      hourlyRequests: [
        { hour: "00h", count: 120, errorCount: 0 },
        { hour: "04h", count: 90, errorCount: 0 },
        { hour: "08h", count: 890, errorCount: 1 },
        { hour: "12h", count: 2100, errorCount: 0 },
        { hour: "16h", count: 2450, errorCount: 2 },
        { hour: "20h", count: 1100, errorCount: 0 },
      ],
    },
    tools: [
      {
        id: "tool_gh_1",
        name: "create_issue",
        description: "Crée une nouvelle issue sur un dépôt GitHub ciblé.",
        isActive: true,
        category: "Issues",
        totalCalls: 4210,
        createdAt: "2026-08-15T14:30:00Z",
        updatedAt: "2026-08-20T10:00:00Z",
        params: [
          { name: "repo", type: "string", description: "Format owner/repo (ex: org/app)", required: true },
          { name: "title", type: "string", description: "Titre de l'issue", required: true },
          { name: "body", type: "string", description: "Description markdown de l'issue", required: true },
          { name: "labels", type: "array", description: "Liste des labels à assigner", required: false },
        ],
        executionMode: "http",
        httpConfig: {
          method: "POST",
          url: "https://api.github.com/repos/{{repo}}/issues",
          authType: "bearer",
          authSecretKey: "GITHUB_PAT",
          bodyTemplate: '{\n  "title": "{{title}}",\n  "body": "{{body}}",\n  "labels": {{labels}}\n}',
        },
      },
      {
        id: "tool_gh_2",
        name: "list_pull_requests",
        description: "Liste les pull requests ouvertes ou fermées sur un dépôt avec détails des relecteurs.",
        isActive: true,
        category: "PRs",
        totalCalls: 6300,
        createdAt: "2026-08-15T15:00:00Z",
        updatedAt: "2026-08-22T11:00:00Z",
        params: [
          { name: "repo", type: "string", description: "Dépôt (owner/repo)", required: true },
          { name: "state", type: "string", description: "Statut des PRs", required: false, enumOptions: ["open", "closed", "all"], defaultValue: "open" },
        ],
        executionMode: "http",
        httpConfig: {
          method: "GET",
          url: "https://api.github.com/repos/{{repo}}/pulls",
          authType: "bearer",
          authSecretKey: "GITHUB_PAT",
        },
      },
    ],
  },
  {
    id: "postgres-data-query",
    name: "Postgres-Data-Query",
    description: "Serveur MCP d'analyse de base de données PostgreSQL avec exécution sécurisée en lecture seule.",
    status: "active",
    sseEndpoint: "https://mcp.builder.dev/postgres-data-query/sse",
    region: "eu-west-3 (Paris)",
    runtime: "Python 3.11",
    vCpu: 1.0,
    memoryMb: 2048,
    createdAt: "2026-08-18T11:00:00Z",
    updatedAt: "2026-08-30T12:00:00Z",
    bearerTokens: [],
    secrets: [
      {
        id: "sec_pg_1",
        key: "DATABASE_URL",
        value: "postgres://readonly_user:secretpass@db.internal.aws:5432/analytics",
        description: "Chaîne de connexion PostgreSQL en lecture seule",
        updatedAt: "2026-08-18T11:05:00Z",
      },
    ],
    metrics: {
      totalRequests24h: 8930,
      successRate: 98.8,
      avgLatencyMs: 62,
      activeClientsCount: 3,
      hourlyRequests: [
        { hour: "00h", count: 100, errorCount: 0 },
        { hour: "04h", count: 40, errorCount: 0 },
        { hour: "08h", count: 620, errorCount: 2 },
        { hour: "12h", count: 1800, errorCount: 5 },
        { hour: "16h", count: 1950, errorCount: 4 },
        { hour: "20h", count: 800, errorCount: 1 },
      ],
    },
    tools: [
      {
        id: "tool_pg_1",
        name: "execute_read_query",
        description: "Exécute une requête SQL SELECT avec limitation stricte à 100 lignes et timeout de 5 secondes.",
        isActive: true,
        category: "Queries",
        totalCalls: 7200,
        createdAt: "2026-08-18T11:30:00Z",
        updatedAt: "2026-08-25T16:00:00Z",
        params: [
          { name: "query", type: "string", description: "Requête SQL SELECT uniquement", required: true },
          { name: "max_rows", type: "number", description: "Limite de lignes retournées (max 200)", required: false, defaultValue: "50" },
        ],
        executionMode: "code",
        codeConfig: {
          language: "python",
          code: `import psycopg2
import os

def handler(params, context):
    query = params.get("query", "").strip()
    if not query.lower().startswith("select"):
        raise ValueError("Only SELECT queries are permitted for safety reasons.")
    
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cursor = conn.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    return {"rows": rows, "count": len(rows)}`,
        },
      },
    ],
  },
  {
    id: "notion-knowledge-base",
    name: "Notion-Knowledge-Base",
    description: "Connecteur vers l'espace de travail Notion pour la documentation d'architecture et les wikis internes.",
    status: "deploying",
    sseEndpoint: "https://mcp.builder.dev/notion-knowledge-base/sse",
    region: "eu-west-1 (Ireland)",
    runtime: "Node.js 20",
    vCpu: 0.25,
    memoryMb: 512,
    createdAt: "2026-08-30T19:00:00Z",
    updatedAt: "2026-08-30T19:15:00Z",
    bearerTokens: [],
    secrets: [
      {
        id: "sec_notion_1",
        key: "NOTION_TOKEN",
        value: "secret_mock_notion_token_12345",
        description: "Notion Internal Integration Token",
        updatedAt: "2026-08-30T19:05:00Z",
      },
    ],
    metrics: {
      totalRequests24h: 120,
      successRate: 100,
      avgLatencyMs: 45,
      activeClientsCount: 1,
      hourlyRequests: [],
    },
    tools: [
      {
        id: "tool_notion_1",
        name: "search_pages",
        description: "Effectue une recherche textuelle parmi toutes les pages autorisées de l'espace Notion.",
        isActive: true,
        category: "Search",
        totalCalls: 120,
        createdAt: "2026-08-30T19:10:00Z",
        updatedAt: "2026-08-30T19:10:00Z",
        params: [
          { name: "query", type: "string", description: "Termes de recherche", required: true },
          { name: "sort_direction", type: "string", description: "Direction du tri", required: false, enumOptions: ["ascending", "descending"] },
        ],
        executionMode: "http",
        httpConfig: {
          method: "POST",
          url: "https://api.notion.com/v1/search",
          authType: "bearer",
          authSecretKey: "NOTION_TOKEN",
          headers: [{ key: "Notion-Version", value: "2022-06-28" }],
          bodyTemplate: '{\n  "query": "{{query}}"\n}',
        },
      },
    ],
  },
];

export const INITIAL_LOGS: Record<string, LogEntry[]> = {
  "stripe-ops-prod": [
    {
      id: "log_1",
      timestamp: "2026-08-30T20:51:14.280Z",
      level: "info",
      toolName: "list_invoices",
      clientType: "Claude Desktop",
      status: "success",
      durationMs: 42,
      requestPayload: { customer_id: "cus_N83a7c92b", status: "open", limit: 5 },
      responsePayload: {
        object: "list",
        data: [
          { id: "in_1Px980", amount_due: 4900, currency: "eur", status: "open", customer: "cus_N83a7c92b" },
          { id: "in_1Px981", amount_due: 1200, currency: "eur", status: "open", customer: "cus_N83a7c92b" },
        ],
        has_more: false,
      },
      rawSseEvent: 'event: message\ndata: {"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_invoices","arguments":{"customer_id":"cus_N83a7c92b","status":"open","limit":5}}}',
    },
    {
      id: "log_2",
      timestamp: "2026-08-30T20:48:32.110Z",
      level: "info",
      toolName: "create_payment_intent",
      clientType: "Cursor",
      status: "success",
      durationMs: 65,
      requestPayload: { amount: 3500, currency: "eur", customer_id: "cus_N83a7c92b", description: "Recharge de crédits MCP Builder" },
      responsePayload: {
        id: "pi_3Q88x1",
        status: "requires_payment_method",
        amount: 3500,
        currency: "eur",
        client_secret: "pi_3Q88x1_secret_998a7b",
      },
      rawSseEvent: 'event: message\ndata: {"jsonrpc":"2.0","method":"tools/call","params":{"name":"create_payment_intent","arguments":{"amount":3500,"currency":"eur"}}}',
    },
    {
      id: "log_3",
      timestamp: "2026-08-30T20:42:05.412Z",
      level: "error",
      toolName: "refund_charge",
      clientType: "Claude Code",
      status: "error",
      durationMs: 88,
      requestPayload: { charge_id: "ch_invalid_id_999", reason: "requested_by_customer" },
      responsePayload: {
        error: {
          type: "invalid_request_error",
          message: "No such charge: 'ch_invalid_id_999'",
          code: "resource_missing",
        },
      },
      rawSseEvent: 'event: message\ndata: {"jsonrpc":"2.0","id":102,"error":{"code":-32603,"message":"No such charge"}}',
    },
    {
      id: "log_4",
      timestamp: "2026-08-30T20:35:19.890Z",
      level: "info",
      toolName: "retrieve_customer_balance",
      clientType: "Windsurf",
      status: "success",
      durationMs: 29,
      requestPayload: { customer_id: "cus_N83a7c92b" },
      responsePayload: {
        customerId: "cus_N83a7c92b",
        balance: 0,
        currency: "eur",
        delinquent: false,
      },
    },
  ],
};

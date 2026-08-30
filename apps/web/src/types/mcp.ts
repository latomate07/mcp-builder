export type ServerStatus = "active" | "deploying" | "error" | "stopped";

export type ParamType = "string" | "number" | "boolean" | "array" | "object";

export interface ToolParam {
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
  defaultValue?: string;
  enumOptions?: string[];
}

export type ExecutionMode = "http" | "code";

export interface HttpExecutionConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers?: { key: string; value: string }[];
  queryParams?: { key: string; value: string }[];
  bodyTemplate?: string;
  authType?: "none" | "bearer" | "basic" | "custom_header";
  authSecretKey?: string;
}

export interface CodeExecutionConfig {
  language: "typescript" | "python";
  code: string;
}

export interface McpTool {
  id: string;
  name: string; // snake_case
  description: string;
  isActive: boolean;
  category?: string;
  params: ToolParam[];
  executionMode: ExecutionMode;
  httpConfig?: HttpExecutionConfig;
  codeConfig?: CodeExecutionConfig;
  createdAt: string;
  updatedAt: string;
  totalCalls: number;
}

export interface SecretItem {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  toolName?: string;
  clientType: "Claude Desktop" | "Cursor" | "Claude Code" | "Windsurf" | "Custom Agent";
  status: "success" | "error";
  durationMs: number;
  requestPayload: Record<string, any>;
  responsePayload: Record<string, any>;
  rawSseEvent?: string;
}

export interface ServerMetrics {
  totalRequests24h: number;
  successRate: number; // e.g. 99.4
  avgLatencyMs: number; // e.g. 42
  activeClientsCount: number;
  hourlyRequests: { hour: string; count: number; errorCount: number }[];
}

export interface McpServer {
  id: string; // slug e.g. stripe-ops-prod
  name: string; // "Stripe-Ops-Prod"
  description: string;
  status: ServerStatus;
  sseEndpoint: string;
  region: string;
  runtime: "Node.js 20" | "Python 3.11";
  vCpu: number; // 0.25 to 2.0
  memoryMb: number; // 512 to 4096
  createdAt: string;
  updatedAt: string;
  tools: McpTool[];
  secrets: SecretItem[];
  metrics: ServerMetrics;
  customDomain?: string;
  customDomainVerified?: boolean;
  bearerTokens: { id: string; name: string; token: string; createdAt: string; lastUsed?: string }[];
}

export interface AccountSettings {
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  avatarUrl: string;
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
  globalApiKeys: { id: string; name: string; key: string; createdAt: string }[];
  plan: "Pro Developer" | "Enterprise" | "Free Tier";
  creditsBalance: number;
  monthlySpend: number;
  spendLimit: number;
  billingEmail: string;
}

export interface ServerTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  iconName: string;
  color: string;
  toolsCount: number;
  sampleTools: Partial<McpTool>[];
  suggestedSecrets: string[];
}

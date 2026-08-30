"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  McpServer,
  McpTool,
  SecretItem,
  LogEntry,
  AccountSettings,
} from "@/types/mcp";
import {
  INITIAL_SERVERS,
  INITIAL_ACCOUNT_SETTINGS,
  INITIAL_LOGS,
} from "@/lib/mock-data";

interface McpContextType {
  servers: McpServer[];
  activeServerId: string | null;
  activeServer: McpServer | undefined;
  account: AccountSettings;
  logs: Record<string, LogEntry[]>;
  setActiveServerId: (id: string | null) => void;
  createServer: (
    data: Partial<McpServer> & { name: string; description: string }
  ) => McpServer;
  updateServer: (id: string, updates: Partial<McpServer>) => void;
  deleteServer: (id: string) => void;
  restartServer: (id: string) => Promise<void>;
  toggleServerStatus: (id: string) => void;
  addTool: (
    serverId: string,
    tool: Omit<McpTool, "id" | "createdAt" | "updatedAt" | "totalCalls">
  ) => McpTool;
  updateTool: (serverId: string, toolId: string, updates: Partial<McpTool>) => void;
  deleteTool: (serverId: string, toolId: string) => void;
  toggleToolActive: (serverId: string, toolId: string) => void;
  addSecret: (serverId: string, secret: { key: string; value: string; description?: string }) => void;
  deleteSecret: (serverId: string, secretId: string) => void;
  updateSecret: (serverId: string, secretId: string, updates: Partial<SecretItem>) => void;
  bulkAddSecrets: (serverId: string, envText: string) => number;
  importOpenApiTools: (serverId: string, tools: McpTool[]) => number;
  executeToolSandbox: (
    serverId: string,
    toolId: string,
    params: Record<string, any>
  ) => Promise<{ result: any; isError: boolean; durationMs: number }>;
  addLogEntry: (serverId: string, entry: Omit<LogEntry, "id" | "timestamp">) => void;
  clearLogs: (serverId: string) => void;
  updateAccount: (updates: Partial<AccountSettings>) => void;
  addGlobalApiKey: (name: string) => void;
  deleteGlobalApiKey: (keyId: string) => void;
  addBearerToken: (serverId: string, name: string) => string;
  deleteBearerToken: (serverId: string, tokenId: string) => void;
}

const McpContext = createContext<McpContextType | undefined>(undefined);

const STORAGE_SERVERS_KEY = "mcp_builder_servers_v1";
const STORAGE_ACCOUNT_KEY = "mcp_builder_account_v1";
const STORAGE_LOGS_KEY = "mcp_builder_logs_v1";

export function McpProvider({ children }: { children: React.ReactNode }) {
  const [servers, setServers] = useState<McpServer[]>(INITIAL_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string | null>("stripe-ops-prod");
  const [account, setAccount] = useState<AccountSettings>(INITIAL_ACCOUNT_SETTINGS);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>(INITIAL_LOGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedServers = localStorage.getItem(STORAGE_SERVERS_KEY);
      if (savedServers) {
        setServers(JSON.parse(savedServers));
      }
      const savedAccount = localStorage.getItem(STORAGE_ACCOUNT_KEY);
      if (savedAccount) {
        setAccount(JSON.parse(savedAccount));
      }
      const savedLogs = localStorage.getItem(STORAGE_LOGS_KEY);
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (e) {
      console.warn("Failed to load state from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_SERVERS_KEY, JSON.stringify(servers));
    } catch (e) {}
  }, [servers, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_ACCOUNT_KEY, JSON.stringify(account));
    } catch (e) {}
  }, [account, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
    } catch (e) {}
  }, [logs, isLoaded]);

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];

  const createServer = (
    data: Partial<McpServer> & { name: string; description: string }
  ): McpServer => {
    const slug = (data.id || data.name.toLowerCase().replace(/[^a-z0-9-]/g, "-")).replace(/-+/g, "-");
    const newServer: McpServer = {
      id: slug,
      name: data.name,
      description: data.description,
      status: "active",
      sseEndpoint: `https://mcp.builder.dev/${slug}/sse`,
      region: data.region || "eu-west-3 (Paris)",
      runtime: data.runtime || "Node.js 20",
      vCpu: data.vCpu || 0.5,
      memoryMb: data.memoryMb || 1024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tools: data.tools || [],
      secrets: data.secrets || [],
      bearerTokens: [],
      metrics: {
        totalRequests24h: 0,
        successRate: 100,
        avgLatencyMs: 25,
        activeClientsCount: 1,
        hourlyRequests: [
          { hour: "00h", count: 0, errorCount: 0 },
          { hour: "06h", count: 0, errorCount: 0 },
          { hour: "12h", count: 0, errorCount: 0 },
          { hour: "18h", count: 0, errorCount: 0 },
        ],
      },
    };

    setServers((prev) => [newServer, ...prev]);
    setActiveServerId(newServer.id);
    return newServer;
  };

  const updateServer = (id: string, updates: Partial<McpServer>) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      )
    );
  };

  const deleteServer = (id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
    if (activeServerId === id) {
      const remaining = servers.filter((s) => s.id !== id);
      setActiveServerId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const restartServer = async (id: string) => {
    updateServer(id, { status: "deploying" });
    await new Promise((r) => setTimeout(r, 2000));
    updateServer(id, { status: "active" });
  };

  const toggleServerStatus = (id: string) => {
    const s = servers.find((x) => x.id === id);
    if (!s) return;
    const nextStatus = s.status === "active" ? "stopped" : "active";
    updateServer(id, { status: nextStatus });
  };

  const addTool = (
    serverId: string,
    toolData: Omit<McpTool, "id" | "createdAt" | "updatedAt" | "totalCalls">
  ): McpTool => {
    const newTool: McpTool = {
      ...toolData,
      id: `tool_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalCalls: 0,
    };

    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, tools: [newTool, ...s.tools] } : s))
    );
    return newTool;
  };

  const updateTool = (serverId: string, toolId: string, updates: Partial<McpTool>) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return {
          ...s,
          tools: s.tools.map((t) =>
            t.id === toolId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        };
      })
    );
  };

  const deleteTool = (serverId: string, toolId: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return { ...s, tools: s.tools.filter((t) => t.id !== toolId) };
      })
    );
  };

  const toggleToolActive = (serverId: string, toolId: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return {
          ...s,
          tools: s.tools.map((t) => (t.id === toolId ? { ...t, isActive: !t.isActive } : t)),
        };
      })
    );
  };

  const addSecret = (
    serverId: string,
    secret: { key: string; value: string; description?: string }
  ) => {
    const newSecret: SecretItem = {
      id: `sec_${Date.now()}`,
      key: secret.key.trim().toUpperCase(),
      value: secret.value.trim(),
      description: secret.description,
      updatedAt: new Date().toISOString(),
    };

    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        // if key already exists, replace value
        const existingIdx = s.secrets.findIndex((item) => item.key === newSecret.key);
        if (existingIdx >= 0) {
          const updated = [...s.secrets];
          updated[existingIdx] = newSecret;
          return { ...s, secrets: updated };
        }
        return { ...s, secrets: [newSecret, ...s.secrets] };
      })
    );
  };

  const deleteSecret = (serverId: string, secretId: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return { ...s, secrets: s.secrets.filter((sec) => sec.id !== secretId) };
      })
    );
  };

  const updateSecret = (
    serverId: string,
    secretId: string,
    updates: Partial<SecretItem>
  ) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return {
          ...s,
          secrets: s.secrets.map((sec) =>
            sec.id === secretId ? { ...sec, ...updates, updatedAt: new Date().toISOString() } : sec
          ),
        };
      })
    );
  };

  const bulkAddSecrets = (serverId: string, envText: string): number => {
    const lines = envText.split("\n");
    let count = 0;
    const newSecrets: SecretItem[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim().toUpperCase();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key) {
        newSecrets.push({
          id: `sec_${Date.now()}_${count}`,
          key,
          value: val,
          description: "Importé depuis le fichier .env",
          updatedAt: new Date().toISOString(),
        });
        count++;
      }
    }

    if (count > 0) {
      setServers((prev) =>
        prev.map((s) => {
          if (s.id !== serverId) return s;
          const map = new Map<string, SecretItem>();
          s.secrets.forEach((sec) => map.set(sec.key, sec));
          newSecrets.forEach((sec) => map.set(sec.key, sec));
          return { ...s, secrets: Array.from(map.values()) };
        })
      );
    }
    return count;
  };

  const importOpenApiTools = (serverId: string, tools: McpTool[]): number => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return { ...s, tools: [...tools, ...s.tools] };
      })
    );
    return tools.length;
  };

  const addLogEntry = (
    serverId: string,
    entry: Omit<LogEntry, "id" | "timestamp">
  ) => {
    const newEntry: LogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    setLogs((prev) => ({
      ...prev,
      [serverId]: [newEntry, ...(prev[serverId] || [])],
    }));
  };

  const clearLogs = (serverId: string) => {
    setLogs((prev) => ({
      ...prev,
      [serverId]: [],
    }));
  };

  const executeToolSandbox = async (
    serverId: string,
    toolId: string,
    params: Record<string, any>
  ): Promise<{ result: any; isError: boolean; durationMs: number }> => {
    const s = servers.find((x) => x.id === serverId);
    const tool = s?.tools.find((t) => t.id === toolId);
    const startTime = performance.now();

    await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 200) + 120));
    const durationMs = Math.round(performance.now() - startTime);

    if (!tool) {
      return {
        result: {
          jsonrpc: "2.0",
          id: 1,
          error: { code: -32601, message: "Tool not found" },
        },
        isError: true,
        durationMs,
      };
    }

    // Increment tool totalCalls
    updateTool(serverId, toolId, { totalCalls: (tool.totalCalls || 0) + 1 });

    // Mock realistic execution responses based on tool name
    let resultPayload: any;
    let isError = false;

    if (tool.name.includes("invoice") || tool.name.includes("billing")) {
      resultPayload = {
        object: "list",
        data: [
          { id: "in_1Px980", amount: 4900, currency: "eur", status: "paid", customer: params.customer_id || "cus_mock_123" },
          { id: "in_1Px981", amount: 1200, currency: "eur", status: "open", customer: params.customer_id || "cus_mock_123" },
        ],
        total_count: 2,
        has_more: false,
      };
    } else if (tool.name.includes("payment") || tool.name.includes("charge")) {
      resultPayload = {
        id: `pi_${Math.random().toString(36).substring(2, 10)}`,
        status: "succeeded",
        amount: params.amount || 2000,
        currency: params.currency || "eur",
        client_secret: `pi_sec_${Math.random().toString(36).substring(2, 12)}`,
        created: Math.floor(Date.now() / 1000),
      };
    } else if (tool.name.includes("issue") || tool.name.includes("github")) {
      resultPayload = {
        id: 184920,
        number: 42,
        title: params.title || "Bug report from MCP Agent",
        state: "open",
        url: `https://github.com/org/repo/issues/42`,
        created_at: new Date().toISOString(),
      };
    } else if (tool.name.includes("query") || tool.name.includes("postgres")) {
      resultPayload = {
        rows: [
          { id: 1, name: "Acme Corp", plan: "enterprise", mrr: 1200 },
          { id: 2, name: "Starlight AI", plan: "pro", mrr: 300 },
          { id: 3, name: "DevFlow Inc", plan: "pro", mrr: 300 },
        ],
        rowCount: 3,
        executionTimeMs: 14.2,
      };
    } else {
      resultPayload = {
        success: true,
        tool: tool.name,
        executed_with_params: params,
        runtime: s?.runtime || "Node.js 20",
        message: "Tool executed successfully via MCP Server Fargate Runtime.",
        timestamp: new Date().toISOString(),
      };
    }

    const standardMcpResponse = {
      content: [
        {
          type: "text",
          text: JSON.stringify(resultPayload, null, 2),
        },
      ],
      isError: false,
    };

    // Log the event
    addLogEntry(serverId, {
      level: "info",
      toolName: tool.name,
      clientType: "Claude Desktop",
      status: "success",
      durationMs,
      requestPayload: params,
      responsePayload: standardMcpResponse,
      rawSseEvent: `event: message\ndata: ${JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: { name: tool.name, arguments: params },
      })}`,
    });

    return {
      result: standardMcpResponse,
      isError: false,
      durationMs,
    };
  };

  const updateAccount = (updates: Partial<AccountSettings>) => {
    setAccount((prev) => ({ ...prev, ...updates }));
  };

  const addGlobalApiKey = (name: string) => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: name || "Default API Key",
      key: `mcp_sec_live_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`,
      createdAt: new Date().toISOString(),
    };
    setAccount((prev) => ({
      ...prev,
      globalApiKeys: [newKey, ...prev.globalApiKeys],
    }));
  };

  const deleteGlobalApiKey = (keyId: string) => {
    setAccount((prev) => ({
      ...prev,
      globalApiKeys: prev.globalApiKeys.filter((k) => k.id !== keyId),
    }));
  };

  const addBearerToken = (serverId: string, name: string): string => {
    const tokenVal = `mcp_tok_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 8)}`;
    const newToken = {
      id: `tok_${Date.now()}`,
      name: name || "New Client Token",
      token: tokenVal,
      createdAt: new Date().toISOString(),
      lastUsed: "Jamais",
    };

    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return {
          ...s,
          bearerTokens: [newToken, ...(s.bearerTokens || [])],
        };
      })
    );
    return tokenVal;
  };

  const deleteBearerToken = (serverId: string, tokenId: string) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== serverId) return s;
        return {
          ...s,
          bearerTokens: (s.bearerTokens || []).filter((t) => t.id !== tokenId),
        };
      })
    );
  };

  return (
    <McpContext.Provider
      value={{
        servers,
        activeServerId,
        activeServer,
        account,
        logs,
        setActiveServerId,
        createServer,
        updateServer,
        deleteServer,
        restartServer,
        toggleServerStatus,
        addTool,
        updateTool,
        deleteTool,
        toggleToolActive,
        addSecret,
        deleteSecret,
        updateSecret,
        bulkAddSecrets,
        importOpenApiTools,
        executeToolSandbox,
        addLogEntry,
        clearLogs,
        updateAccount,
        addGlobalApiKey,
        deleteGlobalApiKey,
        addBearerToken,
        deleteBearerToken,
      }}
    >
      {children}
    </McpContext.Provider>
  );
}

export function useMcp() {
  const context = useContext(McpContext);
  if (!context) {
    throw new Error("useMcp must be used within an McpProvider");
  }
  return context;
}

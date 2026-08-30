"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Server,
  PlayCircle,
  RotateCw,
  Power,
  Copy,
  Check,
  Zap,
  Activity,
  Clock,
  ShieldCheck,
  Layers,
  Sparkles,
  BookOpen,
  Terminal,
  Radio,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";

export default function ServerOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;
  const { servers, restartServer, toggleServerStatus } = useMcp();
  const [restarting, setRestarting] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const server = servers.find((s) => s.id === serverId) || servers[0];

  if (!server) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-zinc-400">
          Serveur introuvable
        </div>
      </AppLayout>
    );
  }

  const handleCopySSE = async () => {
    await navigator.clipboard.writeText(server.sseEndpoint);
    setCopiedEndpoint(true);
    toast.success("URL de l'endpoint SSE copiée !");
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const handleRestart = async () => {
    setRestarting(true);
    toast.info("Redémarrage de l'instance Fargate...");
    await restartServer(server.id);
    setRestarting(false);
    toast.success("Instance redémarrée !");
  };

  const claudeDesktopSnippet = JSON.stringify(
    {
      mcpServers: {
        [server.id]: {
          url: server.sseEndpoint,
          headers: {
            Authorization: `Bearer ${server.bearerTokens[0]?.token || "YOUR_BEARER_TOKEN"}`,
          },
        },
      },
    },
    null,
    2
  );

  const cursorSnippet = JSON.stringify(
    {
      mcpServers: {
        [server.id]: {
          url: server.sseEndpoint,
          headers: {
            Authorization: `Bearer ${server.bearerTokens[0]?.token || "YOUR_BEARER_TOKEN"}`,
          },
        },
      },
    },
    null,
    2
  );

  const claudeCodeCliSnippet = `claude mcp add ${server.id} ${server.sseEndpoint} --header "Authorization: Bearer ${
    server.bearerTokens[0]?.token || "YOUR_BEARER_TOKEN"
  }"`;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-medium tracking-tight text-white font-mono">
                {server.name}
              </h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {server.status}
              </span>
              <span className="text-[11px] font-mono text-zinc-500 bg-[#171717] px-2 py-0.5 rounded border border-[#262626]">
                {server.runtime}
              </span>
            </div>
            <p className="text-xs text-zinc-400">{server.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestart}
              disabled={restarting}
              className="flex items-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] hover:border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors disabled:opacity-50"
            >
              <RotateCw className={`h-3.5 w-3.5 ${restarting ? "animate-spin text-emerald-400" : ""}`} />
              <span>Redémarrer</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(`/servers/${server.id}/sandbox`)}
              className="flex items-center gap-1.5 rounded-md bg-[#3ECF8E] hover:bg-[#34b27b] px-3 py-1.5 text-xs font-semibold text-black transition-colors"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              <span>Sandbox</span>
            </button>
          </div>
        </div>

        {/* SSE Endpoint Bar (Supabase style) */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-[#121212] border border-[#2e2e2e] flex items-center justify-center text-emerald-400 shrink-0">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500">
                Endpoint SSE Public
              </span>
              <span className="font-mono text-xs text-zinc-200 truncate">
                {server.sseEndpoint}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySSE}
            className="flex items-center justify-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#202020] hover:bg-[#282828] px-3 py-1.5 text-xs text-zinc-300 shrink-0 transition-colors"
          >
            {copiedEndpoint ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        {/* Minimalist Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Appels 24h</div>
            <div className="text-xl font-bold font-mono text-white">
              {formatNumber(server.metrics?.totalRequests24h || 0)}
            </div>
          </div>

          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Taux de Succès</div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {server.metrics?.successRate || 99.6}%
            </div>
          </div>

          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Latence Moyenne</div>
            <div className="text-xl font-bold font-mono text-white">
              {server.metrics?.avgLatencyMs || 34} ms
            </div>
          </div>

          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[10px] uppercase font-semibold text-zinc-500">Tools Disponibles</div>
            <div className="text-xl font-bold font-mono text-white">
              {server.tools.length}
            </div>
          </div>
        </div>

        {/* Quick Connection Snippets */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Configuration Clients IA
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Copiez la configuration JSON pour Claude Desktop ou Cursor.
              </p>
            </div>
          </div>

          <Tabs defaultValue="claude_desktop" className="w-full">
            <TabsList className="bg-[#121212] border border-[#262626] p-1 rounded-lg">
              <TabsTrigger value="claude_desktop" className="text-xs">Claude Desktop</TabsTrigger>
              <TabsTrigger value="cursor" className="text-xs">Cursor</TabsTrigger>
              <TabsTrigger value="claude_code" className="text-xs">Claude Code CLI</TabsTrigger>
            </TabsList>

            <TabsContent value="claude_desktop" className="pt-2">
              <CodeBlock
                code={claudeDesktopSnippet}
                language="json"
                filename="claude_desktop_config.json"
                showLineNumbers
              />
            </TabsContent>

            <TabsContent value="cursor" className="pt-2">
              <CodeBlock
                code={cursorSnippet}
                language="json"
                filename=".cursor/mcp.json"
                showLineNumbers
              />
            </TabsContent>

            <TabsContent value="claude_code" className="pt-2">
              <CodeBlock
                code={claudeCodeCliSnippet}
                language="bash"
                filename="Terminal"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

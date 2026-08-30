"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ScrollText,
  Radio,
  Pause,
  Play,
  Trash2,
  Search,
  BookOpen,
  Sliders,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogEntry } from "@/types/mcp";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function LogsAndTracesPage() {
  const params = useParams();
  const serverId = params.id as string;
  const { servers, logs, clearLogs, addLogEntry } = useMcp();

  const server = servers.find((s) => s.id === serverId) || servers[0];
  const serverLogs = logs[server?.id || ""] || [];

  const [isStreaming, setIsStreaming] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Simulated live event flux
  useEffect(() => {
    if (!isStreaming || !server) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.35 && server.tools.length > 0) {
        const randomTool = server.tools[Math.floor(Math.random() * server.tools.length)];
        const clients: LogEntry["clientType"][] = ["Claude Desktop", "Cursor", "Claude Code"];
        const randomClient = clients[Math.floor(Math.random() * clients.length)];
        const isSuccess = Math.random() > 0.08;
        const duration = Math.floor(Math.random() * 60) + 18;

        addLogEntry(server.id, {
          level: isSuccess ? "info" : "error",
          toolName: randomTool.name,
          clientType: randomClient,
          status: isSuccess ? "success" : "error",
          durationMs: duration,
          requestPayload: { customer_id: "cus_live_test", query: "status check" },
          responsePayload: isSuccess
            ? { content: [{ type: "text", text: JSON.stringify({ status: "success", tool: randomTool.name }) }] }
            : { error: { code: -32603, message: "Internal runtime error" } },
          rawSseEvent: `event: message\ndata: {"jsonrpc":"2.0","method":"tools/call","params":{"name":"${randomTool.name}"}}`,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isStreaming, server, addLogEntry]);

  if (!server) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-zinc-400">Serveur introuvable</div>
      </AppLayout>
    );
  }

  const filteredLogs = serverLogs.filter((log) =>
    (log.toolName && log.toolName.toLowerCase().includes(search.toLowerCase())) ||
    log.clientType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header (Matching Supabase Logs Explorer header from screenshot) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-white">
              Logs Explorer & Traces SSE
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Flux temps réel des événements JSON-RPC 2.0 et historique des appels de tools.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsStreaming(!isStreaming);
                toast.info(isStreaming ? "Streaming SSE en pause" : "Streaming SSE actif");
              }}
              className="flex items-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] hover:border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors"
            >
              {isStreaming ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-amber-400" />
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Pause Live</span>
                  </span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  <span>Reprendre Live</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                clearLogs(server.id);
                toast.info("Logs effacés");
              }}
              className="rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] hover:text-rose-400 px-2.5 py-1.5 text-xs text-zinc-400 transition-colors"
              title="Effacer les logs"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Live SSE Stream Box */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2 text-zinc-400 text-[11px]">
            <div className="flex items-center gap-2">
              <Radio className={`h-3.5 w-3.5 ${isStreaming ? "text-emerald-400 animate-pulse" : "text-zinc-600"}`} />
              <span className="text-white font-medium">Flux SSE Temps Réel</span>
              <span className="text-zinc-500">{server.sseEndpoint}</span>
            </div>
            <span className="text-zinc-500">JSON-RPC 2.0</span>
          </div>

          <div className="max-h-24 overflow-y-auto space-y-1 text-[11px] pr-2">
            {filteredLogs.slice(0, 3).map((l) => (
              <div key={l.id} className="flex items-center gap-2">
                <span className="text-zinc-600 select-none">{l.timestamp.slice(11, 19)}</span>
                <span className={l.status === "success" ? "text-emerald-400" : "text-rose-400"}>
                  {l.status === "success" ? "✔" : "✖"}
                </span>
                <span className="text-zinc-300 font-medium">[{l.clientType}]</span>
                <span className="text-zinc-400">tools/call &rarr;</span>
                <span className="text-white font-mono">{l.toolName}</span>
                <span className="text-zinc-500">({l.durationMs}ms)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Filtrer les logs par tool ou client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#262626] bg-[#171717] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        {/* Table Supabase style */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121212] border-b border-[#262626] text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Horodatage</th>
                  <th className="py-2.5 px-4">Tool Appelé</th>
                  <th className="py-2.5 px-4">Client IA</th>
                  <th className="py-2.5 px-4">Statut</th>
                  <th className="py-2.5 px-4">Arguments IA</th>
                  <th className="py-2.5 px-4 text-right">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232323]">
                {filteredLogs.map((log) => {
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-[#202020] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        {log.toolName}
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {log.clientType}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                          log.status === "success" ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            log.status === "success" ? "bg-emerald-400" : "bg-rose-400"
                          }`} />
                          {log.status === "success" ? "200 OK" : "500 Error"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 max-w-xs truncate">
                        {JSON.stringify(log.requestPayload)}
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-zinc-300">
                        {log.durationMs} ms
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Inspector Detail */}
        <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DialogContent className="max-w-xl bg-[#171717] border-[#2e2e2e] text-zinc-200">
            {selectedLog && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white font-mono text-sm flex items-center gap-2">
                    <span>{selectedLog.toolName}</span>
                    <span className="text-[10px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {selectedLog.status.toUpperCase()}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-400">
                    Appelé par {selectedLog.clientType} ({selectedLog.durationMs}ms)
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-zinc-300">Arguments envoyés</span>
                    <CodeBlock
                      code={JSON.stringify(selectedLog.requestPayload, null, 2)}
                      language="json"
                      showLineNumbers
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-zinc-300">Réponse standard MCP</span>
                    <CodeBlock
                      code={JSON.stringify(selectedLog.responsePayload, null, 2)}
                      language="json"
                      showLineNumbers
                    />
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

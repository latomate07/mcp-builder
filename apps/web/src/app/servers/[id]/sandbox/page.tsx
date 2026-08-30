"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  PlayCircle,
  Play,
  RotateCw,
  Copy,
  Check,
  Clock,
  Terminal,
  FileCode,
  Layers,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import { CodeBlock } from "@/components/ui/code-block";
import { McpTool } from "@/types/mcp";
import { toast } from "sonner";

function SandboxContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const serverId = params.id as string;
  const initialToolParam = searchParams.get("tool");

  const { servers, executeToolSandbox } = useMcp();
  const server = servers.find((s) => s.id === serverId) || servers[0];

  const [selectedToolId, setSelectedToolId] = useState<string>(
    initialToolParam || (server?.tools[0]?.id || "")
  );

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [rawJsonInput, setRawJsonInput] = useState("{}");
  const [inputMode, setInputMode] = useState<"form" | "json">("form");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionDuration, setExecutionDuration] = useState<number | null>(null);

  const activeTool: McpTool | undefined = server?.tools.find((t) => t.id === selectedToolId) || server?.tools[0];

  useEffect(() => {
    if (!activeTool) return;
    const initialValues: Record<string, any> = {};
    activeTool.params.forEach((p) => {
      if (p.defaultValue) {
        initialValues[p.name] = p.type === "number" ? Number(p.defaultValue) : p.defaultValue;
      } else if (p.type === "boolean") {
        initialValues[p.name] = false;
      } else if (p.type === "number") {
        initialValues[p.name] = 10;
      } else if (p.name.includes("id")) {
        initialValues[p.name] = "cus_983ac7b";
      } else {
        initialValues[p.name] = "test_value";
      }
    });

    setFormValues(initialValues);
    setRawJsonInput(JSON.stringify(initialValues, null, 2));
  }, [selectedToolId, activeTool]);

  const handleFormChange = (paramName: string, value: any) => {
    const updated = { ...formValues, [paramName]: value };
    setFormValues(updated);
    setRawJsonInput(JSON.stringify(updated, null, 2));
  };

  const handleExecute = async () => {
    if (!activeTool) return;
    setIsExecuting(true);

    let paramsToSend = formValues;
    if (inputMode === "json") {
      try {
        paramsToSend = JSON.parse(rawJsonInput || "{}");
      } catch (e) {
        toast.error("JSON invalide.");
        setIsExecuting(false);
        return;
      }
    }

    try {
      const response = await executeToolSandbox(server.id, activeTool.id, paramsToSend);
      setExecutionResult(response.result);
      setExecutionDuration(response.durationMs);
      toast.success(`Appel exécuté en ${response.durationMs}ms`);
    } catch (e) {
      toast.error("Erreur d'exécution");
    } finally {
      setIsExecuting(false);
    }
  };

  if (!server) {
    return (
      <div className="py-16 text-center text-zinc-400">Serveur introuvable</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-white">
            Sandbox & Simulation MCP
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Simulateur d&apos;appels d&apos;outils et validation de schémas JSON-RPC.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.open("https://modelcontextprotocol.io/docs/concepts/tools", "_blank")}
            className="flex items-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] px-3 py-1.5 text-xs text-zinc-300 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>MCP Protocol Spec</span>
          </button>
        </div>
      </div>

      {/* 3-Column Supabase Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Column 1: Tools List (3 cols) */}
        <div className="lg:col-span-3 rounded-xl border border-[#262626] bg-[#171717] p-3 space-y-2">
          <div className="text-[10px] uppercase font-semibold text-zinc-500 px-2">
            Tools ({server.tools.length})
          </div>

          <div className="space-y-0.5 max-h-[550px] overflow-y-auto">
            {server.tools.map((t) => {
              const isSelected = t.id === activeTool?.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedToolId(t.id);
                    setExecutionResult(null);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-[#282828] text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{t.name}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Parameters Form (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-4">
          {activeTool ? (
            <>
              <div className="space-y-1 border-b border-[#262626] pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-white">
                    {activeTool.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-[#121212] px-2 py-0.5 rounded border border-[#2e2e2e] text-zinc-400">
                    {activeTool.executionMode}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {activeTool.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-300">Arguments</span>
                <div className="flex bg-[#121212] p-0.5 rounded-md border border-[#2e2e2e]">
                  <button
                    type="button"
                    onClick={() => setInputMode("form")}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      inputMode === "form" ? "bg-[#282828] text-white" : "text-zinc-400"
                    }`}
                  >
                    Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("json")}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      inputMode === "json" ? "bg-[#282828] text-white" : "text-zinc-400"
                    }`}
                  >
                    JSON
                  </button>
                </div>
              </div>

              {inputMode === "form" ? (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {activeTool.params.map((param) => (
                    <div key={param.name} className="space-y-1 text-xs">
                      <label className="font-mono text-zinc-300 font-medium">
                        {param.name} {param.required && <span className="text-rose-400">*</span>}
                      </label>
                      <input
                        type="text"
                        value={formValues[param.name] ?? ""}
                        onChange={(e) => handleFormChange(param.name, e.target.value)}
                        placeholder={param.description}
                        className="w-full h-8 px-2.5 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  ))}
                  {activeTool.params.length === 0 && (
                    <div className="text-center py-6 text-xs text-zinc-500">
                      Aucun argument requis
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  rows={8}
                  value={rawJsonInput}
                  onChange={(e) => setRawJsonInput(e.target.value)}
                  className="w-full p-2.5 font-mono text-xs rounded-md border border-[#2e2e2e] bg-[#121212] text-zinc-200 focus:outline-none"
                />
              )}

              <button
                type="button"
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Play className={`h-3.5 w-3.5 fill-black ${isExecuting ? "animate-spin" : ""}`} />
                <span>{isExecuting ? "Exécution..." : "Exécuter l'appel MCP"}</span>
              </button>
            </>
          ) : null}
        </div>

        {/* Column 3: Output View (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2">
            <span className="text-xs font-semibold text-white">Réponse MCP</span>
            {executionDuration !== null && (
              <span className="font-mono text-[11px] text-emerald-400">
                {executionDuration} ms
              </span>
            )}
          </div>

          {executionResult ? (
            <CodeBlock
              code={
                executionResult.content?.[0]?.text ||
                JSON.stringify(executionResult, null, 2)
              }
              language="json"
              showLineNumbers
            />
          ) : (
            <div className="py-24 text-center text-xs text-zinc-500 space-y-2">
              <Terminal className="h-8 w-8 mx-auto opacity-40" />
              <p>Cliquez sur Exécuter pour simuler l&apos;appel d&apos;outil.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SandboxPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="py-16 text-center text-zinc-500 text-xs">Chargement de la Sandbox...</div>}>
        <SandboxContent />
      </Suspense>
    </AppLayout>
  );
}

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Wrench,
  Plus,
  FileCode,
  Search,
  Trash2,
  Edit,
  PlayCircle,
  Code2,
  Globe,
  Check,
  Eye,
  BookOpen,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import { SupabaseCard } from "@/components/ui/supabase-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { McpTool, ToolParam, ParamType, ExecutionMode } from "@/types/mcp";
import { toast } from "sonner";

export default function ToolsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;
  const { servers, addTool, updateTool, deleteTool, toggleToolActive, importOpenApiTools } = useMcp();

  const server = servers.find((s) => s.id === serverId) || servers[0];

  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);

  // Form State
  const [toolName, setToolName] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [toolCategory, setToolCategory] = useState("General");
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("http");

  // HTTP Config State
  const [httpMethod, setHttpMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("POST");
  const [httpUrl, setHttpUrl] = useState("https://api.example.com/v1/resource");
  const [httpBodyTemplate, setHttpBodyTemplate] = useState('{\n  "name": "{{name}}"\n}');

  // Code Config State
  const [codeContent, setCodeContent] = useState(`export default async function handler(params: any) {
  return { success: true, result: "Tool executed" };
}`);

  // Parameters Builder
  const [toolParams, setToolParams] = useState<ToolParam[]>([
    { name: "query", type: "string", description: "Terme de recherche", required: true },
  ]);

  if (!server) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-zinc-400">
          Serveur introuvable
        </div>
      </AppLayout>
    );
  }

  const filteredTools = server.tools.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const openNewToolEditor = () => {
    setEditingToolId(null);
    setToolName("");
    setToolDescription("");
    setToolCategory("General");
    setToolParams([{ name: "id", type: "string", description: "Identifiant", required: true }]);
    setExecutionMode("http");
    setEditorOpen(true);
  };

  const handleSaveTool = () => {
    const cleanName = toolName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!cleanName || !toolDescription.trim()) {
      toast.error("Nom et description requis.");
      return;
    }

    const payload = {
      name: cleanName,
      description: toolDescription.trim(),
      category: toolCategory,
      isActive: true,
      params: toolParams,
      executionMode,
      httpConfig: executionMode === "http" ? { method: httpMethod, url: httpUrl, bodyTemplate: httpBodyTemplate } : undefined,
      codeConfig: executionMode === "code" ? { language: "typescript" as const, code: codeContent } : undefined,
    };

    if (editingToolId) {
      updateTool(server.id, editingToolId, payload);
      toast.success(`Tool ${cleanName} mis à jour !`);
    } else {
      addTool(server.id, payload);
      toast.success(`Tool ${cleanName} créé avec succès !`);
    }
    setEditorOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-white">
              Tools ({server.tools.length})
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Outils exposés par le protocole Model Context Protocol sur {server.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openNewToolEditor}
              className="flex items-center gap-1.5 rounded-md bg-[#3ECF8E] hover:bg-[#34b27b] px-3 py-1.5 text-xs font-semibold text-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Ajouter un Tool</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Filtrer les outils..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#262626] bg-[#171717] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        {/* Tools Grid (Exact Supabase Card Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            return (
              <SupabaseCard
                key={tool.id}
                title={tool.name}
                description={tool.description}
                badge={tool.executionMode}
                icon={<FileCode className="h-4 w-4 text-emerald-400" />}
                actionLabel="Tester dans Sandbox"
                actionIcon={<Eye className="h-3.5 w-3.5 text-zinc-400" />}
                onAction={() => router.push(`/servers/${server.id}/sandbox?tool=${tool.id}`)}
                onClick={() => router.push(`/servers/${server.id}/sandbox?tool=${tool.id}`)}
              />
            );
          })}

          {filteredTools.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-[#262626] bg-[#171717]/40">
              <Wrench className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Aucun outil configuré</div>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                Créez votre premier tool pour ce serveur MCP.
              </p>
              <button
                type="button"
                onClick={openNewToolEditor}
                className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3 py-1.5 rounded-md"
              >
                + Ajouter un Tool
              </button>
            </div>
          )}
        </div>

        {/* Modal: Ajouter / Modifier un Tool */}
        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="max-w-xl bg-[#171717] border-[#2e2e2e] text-zinc-200">
            <DialogHeader>
              <DialogTitle className="text-white text-base">
                {editingToolId ? "Modifier le Tool" : "Nouveau Tool MCP"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Configuration du schéma JSON Schema pour guidage du LLM et mode d&apos;exécution.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Nom du Tool (snake_case)</label>
                <input
                  type="text"
                  placeholder="ex: get_user_data"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Description (LLM Guidance)</label>
                <textarea
                  rows={3}
                  placeholder="Expliquez à l'agent IA ce que fait ce tool..."
                  value={toolDescription}
                  onChange={(e) => setToolDescription(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Mode d&apos;exécution</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setExecutionMode("http")}
                    className={`flex-1 py-2 px-3 rounded-md border text-center transition-colors ${
                      executionMode === "http"
                        ? "border-[#3ECF8E] bg-emerald-500/10 text-emerald-400 font-medium"
                        : "border-[#2e2e2e] bg-[#121212] text-zinc-400"
                    }`}
                  >
                    Requête HTTP (REST)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExecutionMode("code")}
                    className={`flex-1 py-2 px-3 rounded-md border text-center transition-colors ${
                      executionMode === "code"
                        ? "border-[#3ECF8E] bg-emerald-500/10 text-emerald-400 font-medium"
                        : "border-[#2e2e2e] bg-[#121212] text-zinc-400"
                    }`}
                  >
                    Code Personnalisé (TypeScript)
                  </button>
                </div>
              </div>

              {executionMode === "http" ? (
                <div className="space-y-2 pt-2 border-t border-[#262626]">
                  <div className="flex gap-2">
                    <select
                      value={httpMethod}
                      onChange={(e) => setHttpMethod(e.target.value as any)}
                      className="h-9 px-2 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <input
                      type="url"
                      value={httpUrl}
                      onChange={(e) => setHttpUrl(e.target.value)}
                      placeholder="https://api.example.com/v1/..."
                      className="flex-1 h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#262626]">
                  <textarea
                    rows={6}
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-zinc-200"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-[#262626] pt-3">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveTool}
                className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3.5 py-1.5 rounded-md"
              >
                Enregistrer
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

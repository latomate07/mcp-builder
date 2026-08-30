"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Sliders,
  FileCode,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Server,
  Upload,
  Terminal,
  PlayCircle,
  Eye,
  Check,
  CreditCard,
  GitPullRequest,
  Database,
  MessageSquare,
  Activity,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import { SupabaseCard } from "@/components/ui/supabase-card";
import { INITIAL_TEMPLATES } from "@/lib/mock-data";
import { ServerTemplate, McpTool } from "@/types/mcp";
import { toast } from "sonner";

export default function NewServerWizardPage() {
  const router = useRouter();
  const { createServer } = useMcp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ServerTemplate | null>(INITIAL_TEMPLATES[0]);

  // Form Details
  const [name, setName] = useState(INITIAL_TEMPLATES[0].name);
  const [description, setDescription] = useState(INITIAL_TEMPLATES[0].description);
  const [region, setRegion] = useState("eu-west-3 (Paris)");
  const [runtime, setRuntime] = useState<"Node.js 20" | "Python 3.11">("Node.js 20");

  // OpenAPI spec state
  const [openApiText, setOpenApiText] = useState(`{
  "openapi": "3.0.0",
  "info": { "title": "Custom API", "version": "1.0.0" },
  "paths": {
    "/v1/users": { "get": { "summary": "Lister les utilisateurs", "operationId": "list_users" } },
    "/v1/orders": { "post": { "summary": "Créer une commande", "operationId": "create_order" } }
  }
}`);

  // Deploy simulation
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployedServerId, setDeployedServerId] = useState<string | null>(null);

  // Supabase template cards (mirroring the exact screenshot titles & descriptions + MCP templates)
  const supabaseTemplates = [
    {
      title: "500 Request Codes",
      description: "List all Coreon API requests that responded with 5xx status code.",
      badge: "HTTP",
      templateKey: "stripe",
    },
    {
      title: "Error Count by User",
      description: "Count of errors by users and AI agent client sessions.",
      badge: "Auth",
      templateKey: "github",
    },
    {
      title: "Errors",
      description: "List all Postgres error messages with ERROR, FATAL, or PANIC severity.",
      badge: "Database",
      templateKey: "postgres",
    },
    {
      title: "Auth Endpoint Events",
      description: "Endpoint events filtered by path and token identity.",
      badge: "Security",
      templateKey: "notion",
    },
    {
      title: "Commits by User",
      description: "Count of commits made by users and agents on the database repository.",
      badge: "DevOps",
      templateKey: "github",
    },
    {
      title: "Metadata IP",
      description: "List all IP addresses that used the Coreon MCP API.",
      badge: "Network",
      templateKey: "stripe",
    },
    {
      title: "Slow Response Time",
      description: "List all Coreon API requests that are slow (>200ms latency).",
      badge: "Traces",
      templateKey: "aws",
    },
    {
      title: "REST Requests",
      description: "List all PostgREST endpoints exposed as MCP tools.",
      badge: "PostgREST",
      templateKey: "postgres",
    },
    {
      title: "Requests by Country",
      description: "List all ISO 3166-1-alpha-2-country codes that used the Coreon API.",
      badge: "Geo",
      templateKey: "stripe",
    },
  ];

  const handleSelectTemplateCard = (tmpl: any) => {
    setName(`MCP-${tmpl.title.replace(/\s+/g, "-")}`);
    setDescription(tmpl.description);
    setStep(2);
  };

  const handleStartDeploy = async () => {
    setStep(3);
    setDeployProgress(15);
    setDeployLogs(["[1/4] Provisioning AWS Fargate ECS Task..."]);

    await new Promise((r) => setTimeout(r, 600));
    setDeployProgress(50);
    setDeployLogs((prev) => [...prev, "[2/4] Registering MCP JSON Schemas & tool definitions..."]);

    await new Promise((r) => setTimeout(r, 600));
    setDeployProgress(80);
    setDeployLogs((prev) => [...prev, "[3/4] Establishing secure SSE gateway endpoint..."]);

    await new Promise((r) => setTimeout(r, 500));
    setDeployProgress(100);
    setDeployLogs((prev) => [...prev, "[4/4] Server online and accepting Claude/Cursor connections!"]);

    const newServer = createServer({
      name,
      description,
      region,
      runtime,
      tools: [
        {
          id: `tool_${Date.now()}_1`,
          name: "execute_query",
          description: "Exécute une requête standard sur l'endpoint configuré.",
          isActive: true,
          category: "Default",
          params: [
            { name: "filter", type: "string", description: "Filtre d'exécution", required: false },
          ],
          executionMode: "http",
          totalCalls: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });

    setDeployedServerId(newServer.id);
    toast.success(`Serveur ${newServer.name} déployé avec succès !`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header (Matching Supabase Templates / Documentation / Field Reference in screenshot) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-white">
              Templates
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sélectionnez un modèle pour démarrer instantanément ou configurez un serveur personnalisé.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.open("https://modelcontextprotocol.io", "_blank")}
              className="flex items-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] hover:border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Documentation</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] hover:border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Field Reference</span>
            </button>
          </div>
        </div>

        {/* STEP 1: Supabase Templates Grid (Matching exact screenshot) */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Supabase 3x3 Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supabaseTemplates.map((t, idx) => (
                <SupabaseCard
                  key={idx}
                  title={t.title}
                  description={t.description}
                  badge={t.badge}
                  actionLabel="Preview"
                  onAction={() => handleSelectTemplateCard(t)}
                  onClick={() => handleSelectTemplateCard(t)}
                />
              ))}
            </div>

            {/* Custom or Blank Options */}
            <div className="pt-4 border-t border-[#232323] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-zinc-400">
                Besoin d&apos;un serveur sur-mesure ou d&apos;importer une spec OpenAPI ?
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setName("Serveur-MCP-Vierge");
                    setDescription("Serveur MCP vide prêt à recevoir vos outils manuels.");
                    setStep(2);
                  }}
                  className="rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] px-3 py-1.5 text-xs text-zinc-300 transition-colors"
                >
                  Serveur Vierge
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName("OpenAPI-MCP-Service");
                    setDescription("Serveur généré automatiquement depuis une spécification Swagger/OpenAPI.");
                    setStep(2);
                  }}
                  className="rounded-md bg-[#3ECF8E] hover:bg-[#34b27b] px-3 py-1.5 text-xs font-semibold text-black transition-colors"
                >
                  Continuer avec Configuration &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Configure Details */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-5 rounded-xl border border-[#262626] bg-[#171717] p-6 animate-in fade-in-50 duration-200">
            <div className="border-b border-[#262626] pb-4">
              <h2 className="text-base font-semibold text-white">
                Configuration du Serveur MCP
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Renseignez le nom et les paramètres du runtime AWS Fargate.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Nom de l&apos;instance</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Description (Prompt LLM)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none focus:border-zinc-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Région AWS</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="eu-west-3 (Paris)">eu-west-3 (Paris)</option>
                    <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</option>
                    <option value="eu-west-1 (Ireland)">eu-west-1 (Ireland)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Runtime</label>
                  <select
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value as any)}
                    className="w-full h-9 px-2.5 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="Node.js 20">Node.js 20 (SSE & Fast HTTP)</option>
                    <option value="Python 3.11">Python 3.11 (Data & DB)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#262626] flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Retour aux templates</span>
              </button>

              <button
                type="button"
                onClick={handleStartDeploy}
                className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-4 py-2 rounded-md"
              >
                Lancer le déploiement &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Deploy Progress */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-5 rounded-xl border border-[#262626] bg-[#171717] p-6 text-center animate-in fade-in-50 duration-200">
            <div className="space-y-2">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Server className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold text-white">
                {deployProgress === 100 ? "Déploiement Terminé !" : "Déploiement Fargate en cours..."}
              </h2>
              <p className="text-xs text-zinc-400">
                {deployProgress}% effectué
              </p>
            </div>

            <div className="w-full h-1.5 rounded-full bg-[#232323] overflow-hidden">
              <div
                className="h-full bg-[#3ECF8E] transition-all duration-300 rounded-full"
                style={{ width: `${deployProgress}%` }}
              />
            </div>

            <div className="p-3 rounded-lg bg-[#121212] border border-[#262626] font-mono text-left text-[11px] space-y-1 text-zinc-400 max-h-40 overflow-y-auto">
              {deployLogs.map((l, i) => (
                <div key={i} className="text-emerald-400">
                  {l}
                </div>
              ))}
            </div>

            {deployProgress === 100 && deployedServerId && (
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/servers/${deployedServerId}/sandbox`)}
                  className="rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] px-4 py-2 text-xs text-zinc-200 font-medium"
                >
                  Tester dans la Sandbox
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/servers/${deployedServerId}`)}
                  className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-4 py-2 rounded-md"
                >
                  Accéder à l&apos;Overview &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

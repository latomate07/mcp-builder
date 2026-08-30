"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Server,
  Plus,
  BookOpen,
  Eye,
  FileCode,
  RotateCw,
  Power,
  PlayCircle,
  Clock,
  Layers,
  Zap,
  Search,
  Check,
  ChevronRight,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import { SupabaseCard } from "@/components/ui/supabase-card";
import { toast } from "sonner";
import { formatNumber } from "@/lib/utils";

export default function ServersListPage() {
  const router = useRouter();
  const { servers, setActiveServerId, restartServer, toggleServerStatus } = useMcp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const totalRequests = servers.reduce((acc, s) => acc + (s.metrics?.totalRequests24h || 0), 0);
  const activeCount = servers.filter((s) => s.status === "active").length;
  const avgLatency = Math.round(
    servers.reduce((acc, s) => acc + (s.metrics?.avgLatencyMs || 0), 0) / (servers.length || 1)
  );

  const filteredServers = servers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectServer = (serverId: string) => {
    setActiveServerId(serverId);
    router.push(`/servers/${serverId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Top Header (Matching Supabase Templates / Documentation header from screenshot) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-white">
              Serveurs MCP
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Supervision des instances Model Context Protocol hébergées sur le runtime AWS Fargate.
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
              onClick={() => router.push("/servers/new")}
              className="flex items-center gap-1.5 rounded-md bg-[#3ECF8E] hover:bg-[#34b27b] px-3 py-1.5 text-xs font-semibold text-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nouveau serveur</span>
            </button>
          </div>
        </div>

        {/* Minimalist Stat Counters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Requêtes 24h
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {formatNumber(totalRequests)}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">+14% vs hier</div>
          </div>

          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Latence Moyenne
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {avgLatency} <span className="text-xs text-zinc-500 font-normal">ms</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">AWS Fargate Fastpath</div>
          </div>

          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Instances Actives
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {activeCount} / {servers.length}
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>99.98% Uptime</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
              Tools Actifs
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {servers.reduce((acc, s) => acc + s.tools.length, 0)}
            </div>
            <div className="text-[10px] text-zinc-400">Claude & Cursor Ready</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Filtrer les serveurs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#262626] bg-[#171717] pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="flex items-center gap-1">
            {[
              { label: "Tous", val: "all" },
              { label: "Actifs", val: "active" },
              { label: "En déploiement", val: "deploying" },
              { label: "Arrêtés", val: "stopped" },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  statusFilter === tab.val
                    ? "bg-[#282828] text-white font-medium"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Supabase Cards Grid (Matching the exact card layout from user screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServers.map((server) => {
            return (
              <SupabaseCard
                key={server.id}
                title={server.name}
                description={server.description}
                badge={`${server.tools.length} tools`}
                icon={<Server className="h-4 w-4 text-emerald-400" />}
                actionLabel="Gérer & Tester"
                actionIcon={<Eye className="h-3.5 w-3.5 text-zinc-400" />}
                onAction={() => handleSelectServer(server.id)}
                onClick={() => handleSelectServer(server.id)}
              />
            );
          })}

          {filteredServers.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-xl border border-dashed border-[#262626] bg-[#171717]/40">
              <Server className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-white">Aucun serveur trouvé</div>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                Créez votre première instance MCP pour connecter vos agents IA.
              </p>
              <button
                type="button"
                onClick={() => router.push("/servers/new")}
                className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3 py-1.5 rounded-md"
              >
                + Nouveau serveur
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

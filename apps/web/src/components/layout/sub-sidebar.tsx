"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Plus,
  Server,
  Wrench,
  PlayCircle,
  ScrollText,
  KeyRound,
  Sliders,
  LayoutDashboard,
  Radio,
  FileCode,
  Layers,
  Sparkles,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { cn } from "@/lib/utils";
import { ServerSwitcher } from "@/components/ui/server-switcher";

export function SubSidebar() {
  const pathname = usePathname();
  const { activeServer, servers } = useMcp();
  const currentServerId = activeServer?.id || "stripe-ops-prod";

  const serverItems = [
    { label: "Overview", href: `/servers/${currentServerId}`, activePattern: new RegExp(`^/servers/${currentServerId}$`) },
    { label: "Tools", count: activeServer?.tools.length || 0, href: `/servers/${currentServerId}/tools`, activePattern: new RegExp(`^/servers/${currentServerId}/tools`) },
    { label: "Sandbox", href: `/servers/${currentServerId}/sandbox`, activePattern: new RegExp(`^/servers/${currentServerId}/sandbox`) },
    { label: "Logs Explorer", href: `/servers/${currentServerId}/logs`, live: true, activePattern: new RegExp(`^/servers/${currentServerId}/logs`) },
    { label: "Secrets (.env)", href: `/servers/${currentServerId}/secrets`, activePattern: new RegExp(`^/servers/${currentServerId}/secrets`) },
    { label: "Settings", href: `/servers/${currentServerId}/settings`, activePattern: new RegExp(`^/servers/${currentServerId}/settings`) },
  ];

  const globalItems = [
    { label: "Tous les serveurs", count: servers.length, href: "/servers", activePattern: /^\/servers$/ },
    { label: "Nouveau serveur", href: "/servers/new", activePattern: /^\/servers\/new$/ },
    { label: "Compte & API Keys", href: "/settings", activePattern: /^\/settings/ },
  ];

  return (
    <aside className="w-56 shrink-0 bg-[#171717] border-r border-[#232323] py-4 px-3 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Top Header: Section Title styled like Supabase LOGS EXPLORER */}
        <div className="space-y-2">
          <div className="px-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase flex items-center justify-between">
            <span>MCP BUILDER</span>
            {activeServer && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 lowercase font-normal">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                online
              </span>
            )}
          </div>

          <ServerSwitcher />
        </div>

        {/* Server Context Links */}
        <div className="space-y-1">
          <nav className="space-y-0.5">
            {serverItems.map((item) => {
              const isActive = item.activePattern.test(pathname);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                    isActive
                      ? "bg-[#282828] text-white font-medium shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      {item.count}
                    </span>
                  )}

                  {item.live && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Espace Global Links */}
        <div className="space-y-1 pt-2 border-t border-[#232323]">
          <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            ESPACE
          </div>

          <nav className="space-y-0.5">
            {globalItems.map((item) => {
              const isActive = item.activePattern.test(pathname);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                    isActive
                      ? "bg-[#282828] text-white font-medium shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  )}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-[10px] font-mono text-zinc-500">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom info */}
      <div className="pt-4 border-t border-[#232323] px-2 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
        <span>v1.2.0 • Fargate</span>
        <span className="text-emerald-400">healthy</span>
      </div>
    </aside>
  );
}

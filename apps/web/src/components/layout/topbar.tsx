"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Plus,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Check,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { SearchModal } from "@/components/ui/search-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { account, activeServer, servers, setActiveServerId } = useMcp();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-12 w-full items-center justify-between border-b border-[#232323] bg-[#121212] px-5 backdrop-blur-md">
        {/* Left: Breadcrumbs (Matching Supabase "Ragip Test's Org / test-website_1" in screenshot) */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/servers"
            className="text-zinc-400 hover:text-white font-medium transition-colors"
          >
            MCP Builder
          </Link>
          <span className="text-zinc-600 font-mono">/</span>

          {activeServer ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-white font-medium hover:text-zinc-300 transition-colors focus:outline-none"
                >
                  <span>{activeServer.id}</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-[#171717] border-[#2e2e2e] shadow-2xl p-1">
                <DropdownMenuLabel className="text-[10px] text-zinc-500 uppercase">
                  Changer de Serveur
                </DropdownMenuLabel>
                {servers.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => {
                      setActiveServerId(s.id);
                      router.push(`/servers/${s.id}`);
                    }}
                    className="flex items-center justify-between text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md cursor-pointer"
                  >
                    <span>{s.name}</span>
                    {activeServer.id === s.id && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-[#232323]" />
                <DropdownMenuItem
                  onClick={() => router.push("/servers/new")}
                  className="text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nouveau serveur</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-white font-medium">Tous les serveurs</span>
          )}
        </div>

        {/* Right Action Icons & Controls (Matching Supabase Help, Feedback, Bell) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-md border border-[#2e2e2e] bg-[#1a1a1a] px-2.5 py-1 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-zinc-500" />
            <span>Rechercher...</span>
            <kbd className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-1 rounded">⌘K</kbd>
          </button>

          {/* Help & Feedback buttons */}
          <button
            type="button"
            onClick={() => window.open("https://modelcontextprotocol.io", "_blank")}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Help</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/settings")}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-2 py-1"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Feedback</span>
          </button>

          {/* Notification bell */}
          <button
            type="button"
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
          </button>

          {/* New Server Primary CTA */}
          <button
            type="button"
            onClick={() => router.push("/servers/new")}
            className="hidden sm:flex items-center gap-1.5 bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3 py-1 rounded-md transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau</span>
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
}

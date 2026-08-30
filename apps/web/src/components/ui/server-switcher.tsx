"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Plus,
  Server,
  Check,
  Search,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ServerSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { servers, activeServerId, setActiveServerId, activeServer } = useMcp();
  const [search, setSearch] = useState("");

  const filteredServers = servers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (serverId: string) => {
    setActiveServerId(serverId);
    const match = pathname.match(/^\/servers\/([^\/]+)(\/.*)?$/);
    if (match && match[1] !== "new") {
      const subpath = match[2] || "";
      router.push(`/servers/${serverId}${subpath}`);
    } else {
      router.push(`/servers/${serverId}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#222222] hover:border-zinc-700 p-2 text-left text-xs text-white transition-colors focus:outline-none",
            className
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                activeServer?.status === "active" && "bg-emerald-400",
                activeServer?.status === "deploying" && "bg-sky-400 animate-pulse",
                activeServer?.status === "error" && "bg-rose-400",
                activeServer?.status === "stopped" && "bg-zinc-500"
              )}
            />
            <span className="truncate font-medium">
              {activeServer ? activeServer.name : "Sélectionner un serveur"}
            </span>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 p-1 bg-[#171717] border-[#2e2e2e] shadow-2xl text-zinc-200"
        align="start"
        sideOffset={4}
      >
        <div className="p-1 pb-1.5">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3 w-3 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Filtrer les serveurs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md bg-[#121212] pl-7 pr-2 py-1 text-xs text-white placeholder:text-zinc-500 focus:outline-none border border-[#2e2e2e]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <DropdownMenuLabel className="text-[10px] text-zinc-500 uppercase px-2 py-1">
          Serveurs MCP ({filteredServers.length})
        </DropdownMenuLabel>

        <div className="max-h-48 overflow-y-auto space-y-0.5 my-0.5">
          {filteredServers.map((server) => {
            const isSelected = activeServerId === server.id;
            return (
              <DropdownMenuItem
                key={server.id}
                onClick={() => handleSelect(server.id)}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5 text-xs cursor-pointer hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors",
                  isSelected ? "bg-zinc-800 text-white font-medium" : ""
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      server.status === "active" && "bg-emerald-400",
                      server.status === "deploying" && "bg-sky-400 animate-pulse",
                      server.status === "error" && "bg-rose-400",
                      server.status === "stopped" && "bg-zinc-500"
                    )}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{server.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {server.tools.length} tools • {server.runtime}
                    </span>
                  </div>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-2" />}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="bg-[#232323]" />

        <DropdownMenuItem
          onClick={() => router.push("/servers/new")}
          className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 cursor-pointer p-1.5 rounded-md"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ Nouveau serveur</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

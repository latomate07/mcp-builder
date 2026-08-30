"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Server,
  Wrench,
  KeyRound,
  Terminal,
  Activity,
  Sliders,
  Sparkles,
  Command,
  FileCode,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function SearchModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const router = useRouter();
  const { servers, activeServerId, setActiveServerId } = useMcp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  const allTools = servers.flatMap((s) =>
    s.tools.map((t) => ({ ...t, serverId: s.id, serverName: s.name }))
  );

  const filteredServers = servers.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTools = allTools.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (path: string, serverId?: string) => {
    if (serverId) setActiveServerId(serverId);
    setOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl overflow-hidden shadow-2xl border border-border">
        <div className="flex items-center px-4 border-b border-border bg-card">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un serveur, un tool, des logs, des réglages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 text-sm bg-transparent outline-none placeholder:text-muted-foreground text-foreground"
            autoFocus
          />
          <kbd className="text-[10px] font-mono uppercase bg-muted px-2 py-0.5 rounded-md text-muted-foreground border border-border">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Actions Rapides
              </div>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => navigateTo("/servers/new")}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/80 transition-colors"
                >
                  <div className="h-6 w-6 rounded-lg bg-orange-500/10 text-primary flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span>Créer un nouveau serveur MCP</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo("/servers")}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/80 transition-colors"
                >
                  <div className="h-6 w-6 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Server className="h-3.5 w-3.5" />
                  </div>
                  <span>Tous les serveurs</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo("/settings")}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/80 transition-colors"
                >
                  <div className="h-6 w-6 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center">
                    <Sliders className="h-3.5 w-3.5" />
                  </div>
                  <span>Paramètres du compte & Facturation</span>
                </button>
              </div>
            </div>
          )}

          {/* Servers list */}
          {filteredServers.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Serveurs MCP ({filteredServers.length})
              </div>
              <div className="space-y-0.5">
                {filteredServers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => navigateTo(`/servers/${s.id}`, s.id)}
                    className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Server className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-semibold text-foreground truncate">
                          {s.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {s.description}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono ml-2 shrink-0">
                      {s.runtime}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tools list */}
          {filteredTools.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Tools Détectés ({filteredTools.length})
              </div>
              <div className="space-y-0.5">
                {filteredTools.slice(0, 8).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      navigateTo(`/servers/${t.serverId}/tools`, t.serverId)
                    }
                    className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <Wrench className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-mono font-semibold text-foreground truncate">
                          {t.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {t.description}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground ml-2 shrink-0">
                      {t.serverName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && filteredServers.length === 0 && filteredTools.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Aucun résultat pour « {query} »
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

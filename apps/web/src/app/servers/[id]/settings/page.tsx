"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sliders,
  Globe,
  Cpu,
  KeyRound,
  Trash2,
  Check,
  Copy,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ServerSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;
  const { servers, updateServer, deleteServer, addBearerToken, deleteBearerToken } = useMcp();

  const server = servers.find((s) => s.id === serverId) || servers[0];

  const [customDomain, setCustomDomain] = useState(server?.customDomain || "");
  const [vCpu, setVCpu] = useState(server?.vCpu || 0.5);
  const [memoryMb, setMemoryMb] = useState(server?.memoryMb || 1024);
  const [newTokenName, setNewTokenName] = useState("");
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  if (!server) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-zinc-400">Serveur introuvable</div>
      </AppLayout>
    );
  }

  const handleApplyResources = () => {
    updateServer(server.id, { vCpu, memoryMb });
    toast.success("Ressources Fargate appliquées !");
  };

  const handleCreateToken = () => {
    if (!newTokenName.trim()) return;
    addBearerToken(server.id, newTokenName.trim());
    setNewTokenName("");
    toast.success("Bearer Token généré !");
  };

  const handleCopyToken = async (id: string, token: string) => {
    await navigator.clipboard.writeText(token);
    setCopiedTokenId(id);
    toast.success("Token copié");
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const handleDeleteServer = () => {
    if (confirmName !== server.name) {
      toast.error("Le nom ne correspond pas.");
      return;
    }
    deleteServer(server.id);
    toast.error(`Serveur ${server.name} supprimé.`);
    router.push("/servers");
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Top Header */}
        <div className="border-b border-[#232323] pb-4">
          <h1 className="text-xl font-medium tracking-tight text-white font-mono">
            Paramètres du Serveur — {server.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Domaines personnalisés, dimensionnement Fargate et gestion des jetons clients.
          </p>
        </div>

        {/* Section 1: Domaine Personnalisé */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Domaine Personnalisé & SSL</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Associez un CNAME pointant vers `cname.mcp.builder.dev`.
            </p>
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="mcp.mycompany.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="flex-1 h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                updateServer(server.id, { customDomain, customDomainVerified: true });
                toast.success("Certificat SSL actif");
              }}
              className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3 rounded-md"
            >
              Vérifier DNS
            </button>
          </div>
        </div>

        {/* Section 2: Fargate Resources */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Ressources AWS Fargate</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Allocation CPU et mémoire RAM pour ce runtime conteneurisé.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400">vCPU</label>
              <select
                value={vCpu}
                onChange={(e) => setVCpu(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white"
              >
                <option value={0.25}>0.25 vCPU</option>
                <option value={0.5}>0.5 vCPU</option>
                <option value={1.0}>1.0 vCPU</option>
                <option value={2.0}>2.0 vCPU</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">RAM (MB)</label>
              <select
                value={memoryMb}
                onChange={(e) => setMemoryMb(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white"
              >
                <option value={512}>512 MB</option>
                <option value={1024}>1024 MB (1 GB)</option>
                <option value={2048}>2048 MB (2 GB)</option>
                <option value={4096}>4096 MB (4 GB)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyResources}
            className="rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] px-3.5 py-1.5 text-xs text-zinc-300 transition-colors"
          >
            Sauvegarder l&apos;allocation
          </button>
        </div>

        {/* Section 3: Bearer Tokens */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Jetons d&apos;Accès Client (Bearer Tokens)</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Générez des clés d&apos;authentification pour Claude Desktop et Cursor.
            </p>
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Nom (ex: Claude Desktop Dev)"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              className="flex-1 h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCreateToken}
              className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3 rounded-md"
            >
              Générer
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {server.bearerTokens.map((tok) => (
              <div
                key={tok.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-[#2e2e2e] bg-[#121212] text-xs"
              >
                <div>
                  <div className="font-medium text-white">{tok.name}</div>
                  <div className="font-mono text-[11px] text-zinc-500">{tok.token.substring(0, 14)}••••••••</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopyToken(tok.id, tok.token)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    {copiedTokenId === tok.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteBearerToken(server.id, tok.id);
                      toast.error("Token supprimé");
                    }}
                    className="p-1 text-zinc-400 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Zone de Danger */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-rose-400">Supprimer le serveur MCP</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Détruit définitivement le conteneur Fargate, les endpoints et tous les tools.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="rounded-md border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 text-xs font-medium"
          >
            Supprimer l&apos;instance
          </button>
        </div>

        {/* Modal: Confirmation */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="max-w-md bg-[#171717] border-[#2e2e2e] text-zinc-200">
            <DialogHeader>
              <DialogTitle className="text-rose-400 text-base">Confirmer la suppression</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Tapez le nom exact <strong className="text-white font-mono">{server.name}</strong> pour confirmer.
              </DialogDescription>
            </DialogHeader>

            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder={server.name}
              className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white focus:outline-none"
            />

            <DialogFooter className="border-t border-[#262626] pt-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={confirmName !== server.name}
                onClick={handleDeleteServer}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold text-xs px-3.5 py-1.5 rounded-md"
              >
                Supprimer
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  KeyRound,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Lock,
  Upload,
  ShieldCheck,
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

export default function SecretsPage() {
  const params = useParams();
  const serverId = params.id as string;
  const { servers, addSecret, deleteSecret, bulkAddSecrets } = useMcp();

  const server = servers.find((s) => s.id === serverId) || servers[0];

  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkEnvText, setBulkEnvText] = useState(`STRIPE_SECRET_KEY=sk_test_mock_stripe_key_abcdef1234567890\nOPENAI_API_KEY=sk-test-mock-openai-key-abcdef1234567890`);

  if (!server) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-zinc-400">Serveur introuvable</div>
      </AppLayout>
    );
  }

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    toast.success("Secret copié");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSecret = () => {
    const cleanKey = newKey.trim().toUpperCase();
    if (!cleanKey || !newValue.trim()) {
      toast.error("Nom et valeur requis.");
      return;
    }
    addSecret(server.id, {
      key: cleanKey,
      value: newValue.trim(),
      description: newDescription.trim(),
    });
    setNewKey("");
    setNewValue("");
    setNewDescription("");
    setAddModalOpen(false);
    toast.success(`Secret ${cleanKey} enregistré !`);
  };

  const handleBulkImport = () => {
    const count = bulkAddSecrets(server.id, bulkEnvText);
    if (count === 0) {
      toast.error("Aucun secret valide détecté.");
      return;
    }
    setBulkModalOpen(false);
    toast.success(`${count} variables importées !`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-white">
              Secrets & Variables d&apos;Environnement ({server.secrets.length})
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Variables injectées de façon chiffrée dans le runtime Fargate de {server.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBulkModalOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#242424] px-3 py-1.5 text-xs text-zinc-300 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Importer .env</span>
            </button>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-md bg-[#3ECF8E] hover:bg-[#34b27b] px-3 py-1.5 text-xs font-semibold text-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouveau Secret</span>
            </button>
          </div>
        </div>

        {/* Security Banner */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-3.5 flex items-center gap-3 text-xs text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Chiffrement au repos AES-256 via AWS KMS. Variables injectées à chaque démarrage d&apos;instance.</span>
        </div>

        {/* Secrets Table (Supabase Vault style) */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] border-b border-[#262626] text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Clé (.env)</th>
                <th className="py-2.5 px-4">Valeur Chiffrée</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232323]">
              {server.secrets.map((sec) => {
                const isRevealed = !!revealedIds[sec.id];
                return (
                  <tr key={sec.id} className="hover:bg-[#202020] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-white">
                      {sec.key}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {isRevealed ? sec.value : "••••••••••••••••••••••••"}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-xs">
                      {sec.description || "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => toggleReveal(sec.id)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                        >
                          {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(sec.id, sec.value)}
                          className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                        >
                          {copiedId === sec.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteSecret(server.id, sec.id);
                            toast.error(`Secret ${sec.key} supprimé`);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-800"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal: Add Secret */}
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogContent className="max-w-md bg-[#171717] border-[#2e2e2e] text-zinc-200">
            <DialogHeader>
              <DialogTitle className="text-white text-base">Ajouter un Secret</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                La clé sera disponible dans le runtime via `ctx.secrets[KEY]`.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Clé (UPPER_SNAKE_CASE)</label>
                <input
                  type="text"
                  placeholder="ex: STRIPE_SECRET_KEY"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Valeur</label>
                <input
                  type="password"
                  placeholder="sk_test_..."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] font-mono text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Description</label>
                <input
                  type="text"
                  placeholder="ex: Clé d'API Stripe"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <DialogFooter className="border-t border-[#262626] pt-3">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddSecret}
                className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3.5 py-1.5 rounded-md"
              >
                Enregistrer
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal: Bulk Import */}
        <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
          <DialogContent className="max-w-lg bg-[#171717] border-[#2e2e2e] text-zinc-200">
            <DialogHeader>
              <DialogTitle className="text-white text-base">Importer fichier .env</DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Collez vos variables au format KEY=VALUE.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <textarea
                rows={8}
                value={bulkEnvText}
                onChange={(e) => setBulkEnvText(e.target.value)}
                className="w-full p-2.5 font-mono text-xs rounded-md border border-[#2e2e2e] bg-[#121212] text-zinc-200 focus:outline-none"
              />
            </div>

            <DialogFooter className="border-t border-[#262626] pt-3">
              <button
                type="button"
                onClick={() => setBulkModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3.5 py-1.5 rounded-md"
              >
                Importer
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

"use client";

import React, { useState } from "react";
import {
  User,
  KeyRound,
  Trash2,
  Plus,
  Copy,
  Check,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { AppLayout } from "@/components/layout/app-layout";
import { toast } from "sonner";

export default function SettingsPage() {
  const { account, updateAccount, addGlobalApiKey, deleteGlobalApiKey } = useMcp();

  const [name, setName] = useState(account.name);
  const [email, setEmail] = useState(account.email);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleSaveProfile = () => {
    updateAccount({ name, email });
    toast.success("Profil mis à jour !");
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return;
    addGlobalApiKey(newKeyName.trim());
    setNewKeyName("");
    toast.success("Clé d'API globale créée !");
  };

  const handleCopyKey = async (id: string, key: string) => {
    await navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    toast.success("Clé copiée");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Top Header */}
        <div className="border-b border-[#232323] pb-4">
          <h1 className="text-xl font-medium tracking-tight text-white">
            Paramètres du Compte & Clés d&apos;API
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gérez vos informations de compte, vos clés globales CLI et vos quotas.
          </p>
        </div>

        {/* Section 1: Profil */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Profil Utilisateur</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Informations d&apos;identité et adresse de facturation.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full overflow-hidden border border-[#2e2e2e]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={account.avatarUrl}
                alt={account.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white">{account.name}</div>
              <div className="text-[11px] text-zinc-400 font-mono">{account.email}</div>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Email Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3.5 py-1.5 rounded-md"
          >
            Enregistrer
          </button>
        </div>

        {/* Section 2: Clés API Globales */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Clés d&apos;API Globales</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Utilisées pour l&apos;authentification de votre CLI `mcp-builder` ou dans les pipelines CI/CD.
            </p>
          </div>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Nom de la clé (ex: GitHub Actions)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 h-9 px-3 rounded-md border border-[#2e2e2e] bg-[#121212] text-xs text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCreateApiKey}
              className="bg-[#3ECF8E] hover:bg-[#34b27b] text-black font-semibold text-xs px-3 rounded-md"
            >
              Créer
            </button>
          </div>

          <div className="space-y-2">
            {account.globalApiKeys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between p-3 rounded-lg border border-[#2e2e2e] bg-[#121212] text-xs"
              >
                <div>
                  <div className="font-medium text-white">{k.name}</div>
                  <div className="font-mono text-[11px] text-zinc-500">{k.key.substring(0, 16)}••••••••••••</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopyKey(k.id, k.key)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    {copiedKeyId === k.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteGlobalApiKey(k.id);
                      toast.error("Clé révoquée");
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

        {/* Section 3: Quotas & Facturation */}
        <div className="rounded-xl border border-[#262626] bg-[#171717] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Quotas & Forfait</h2>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">{account.plan}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase">Solde Prépayé</span>
              <div className="text-lg font-bold font-mono text-white">${account.creditsBalance.toFixed(2)}</div>
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#232323] overflow-hidden">
            <div
              className="h-full bg-[#3ECF8E] rounded-full"
              style={{ width: `${(account.monthlySpend / account.spendLimit) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-zinc-400 pt-1">
            <span>Dépenses ce mois-ci : ${account.monthlySpend.toFixed(2)}</span>
            <span>Limite : ${account.spendLimit.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

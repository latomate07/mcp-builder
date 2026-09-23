"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { McpLogo } from "@/components/ui/mcp-logo";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoaded } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      router.replace("/servers");
    }
  }, [isLoaded, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);
    if (result.success) {
      router.push("/servers");
    } else {
      setError(result.error || "Impossible de se connecter.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0c] bg-supabase-dots px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <McpLogo size="lg" />
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">Bon retour</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Connectez-vous à votre compte MCP Builder
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#232323] bg-[#121212] p-6 shadow-2xl space-y-4"
        >
          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-zinc-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-zinc-300">
                Mot de passe
              </label>
              <Link
                href="#"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="orange"
            size="lg"
            className="w-full gap-2"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

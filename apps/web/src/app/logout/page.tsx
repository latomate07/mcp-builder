"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { McpLogo } from "@/components/ui/mcp-logo";

export default function LogoutPage() {
  const router = useRouter();
  const { logout, isAuthenticated, isLoaded } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    logout();
    setDone(true);
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 900);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isAuthenticated]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0c] bg-supabase-dots px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <McpLogo size="lg" />
        <div className="flex items-center gap-2 text-zinc-300">
          {done ? (
            <LogOut className="h-4 w-4 text-emerald-400" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          )}
          <span className="text-sm">
            {done ? "Vous avez été déconnecté." : "Déconnexion en cours..."}
          </span>
        </div>
      </div>
    </div>
  );
}

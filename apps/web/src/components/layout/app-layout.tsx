"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarRail } from "@/components/layout/sidebar-rail";
import { SubSidebar } from "@/components/layout/sub-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/context/auth-context";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoaded, isAuthenticated, router]);

  if (!isLoaded || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c]">
        <div className="h-5 w-5 rounded-full border-2 border-zinc-700 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0c0c0c] text-zinc-100 antialiased font-sans">
      {/* 1. Far left Icon Rail (50px) */}
      <SidebarRail />

      {/* 2. Secondary Sub-sidebar (220px) */}
      <SubSidebar />

      {/* 3. Main content area with Topbar */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0c] bg-supabase-dots min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}

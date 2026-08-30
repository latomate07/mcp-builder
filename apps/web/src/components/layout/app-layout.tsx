"use client";

import React from "react";
import { SidebarRail } from "@/components/layout/sidebar-rail";
import { SubSidebar } from "@/components/layout/sub-sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
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

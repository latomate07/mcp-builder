"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Table2,
  Wrench,
  PlayCircle,
  ScrollText,
  KeyRound,
  Sliders,
  Settings,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { McpLogo } from "@/components/ui/mcp-logo";
import { cn } from "@/lib/utils";

export function SidebarRail() {
  const pathname = usePathname();
  const { activeServer, account } = useMcp();
  const currentServerId = activeServer?.id || "stripe-ops-prod";

  const railItems = [
    { icon: Home, label: "Tous les serveurs", href: "/servers", activePattern: /^\/servers$/ },
    { icon: Table2, label: "Overview", href: `/servers/${currentServerId}`, activePattern: new RegExp(`^/servers/${currentServerId}$`) },
    { icon: Wrench, label: "Tools", href: `/servers/${currentServerId}/tools`, activePattern: new RegExp(`^/servers/${currentServerId}/tools`) },
    { icon: PlayCircle, label: "Sandbox", href: `/servers/${currentServerId}/sandbox`, activePattern: new RegExp(`^/servers/${currentServerId}/sandbox`) },
    { icon: ScrollText, label: "Logs Explorer", href: `/servers/${currentServerId}/logs`, activePattern: new RegExp(`^/servers/${currentServerId}/logs`) },
    { icon: KeyRound, label: "Secrets (.env)", href: `/servers/${currentServerId}/secrets`, activePattern: new RegExp(`^/servers/${currentServerId}/secrets`) },
    { icon: Sliders, label: "Settings Serveur", href: `/servers/${currentServerId}/settings`, activePattern: new RegExp(`^/servers/${currentServerId}/settings`) },
  ];

  return (
    <div className="w-12 shrink-0 flex flex-col justify-between items-center bg-[#121212] border-r border-[#232323] py-3 z-40 h-screen sticky top-0">
      {/* Top Section: Cyber Dog Logo */}
      <div className="flex flex-col items-center gap-4 w-full">
        <Link
          href="/servers"
          title="MCP Builder (Cyber Dog)"
          className="focus:outline-none"
        >
          <McpLogo size="md" concept="cyber-dog" />
        </Link>

        <div className="w-6 h-[1px] bg-[#232323]" />

        {/* Stacked Rail Icons */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-1.5">
          {railItems.map((item) => {
            const isActive = item.activePattern.test(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all",
                  isActive && "bg-zinc-800 text-white font-semibold"
                )}
              >
                {isActive && (
                  <span className="absolute -left-1.5 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[#3ECF8E]" />
                )}
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Account Settings & Avatar */}
      <div className="flex flex-col items-center gap-2">
        <Link
          href="/settings"
          title="Paramètres du compte"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all",
            pathname === "/settings" && "bg-zinc-800 text-white"
          )}
        >
          <Settings className="h-4 w-4" />
        </Link>

        <Link
          href="/settings"
          className="h-7 w-7 rounded-full overflow-hidden border border-[#2e2e2e] hover:border-zinc-500 transition-colors"
          title={account.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={account.avatarUrl}
            alt={account.name}
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
}

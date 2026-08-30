"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  PlayCircle,
  ScrollText,
  KeyRound,
  Sliders,
  Server,
  UserCheck,
  Zap,
  Radio,
} from "lucide-react";
import { useMcp } from "@/context/mcp-context";
import { ServerSwitcher } from "@/components/ui/server-switcher";
import { LightDarkToggle } from "@/components/ui/light-dark-toggle";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { activeServer } = useMcp();

  const currentServerId = activeServer?.id || "stripe-ops-prod";

  const serverNavItems = [
    {
      title: "Overview",
      href: `/servers/${currentServerId}`,
      icon: LayoutDashboard,
      activePattern: new RegExp(`^/servers/${currentServerId}$`),
    },
    {
      title: "Tools",
      href: `/servers/${currentServerId}/tools`,
      icon: Wrench,
      badge: activeServer ? activeServer.tools.length : 0,
      activePattern: new RegExp(`^/servers/${currentServerId}/tools`),
    },
    {
      title: "Sandbox",
      href: `/servers/${currentServerId}/sandbox`,
      icon: PlayCircle,
      activePattern: new RegExp(`^/servers/${currentServerId}/sandbox`),
    },
    {
      title: "Logs & Traces",
      href: `/servers/${currentServerId}/logs`,
      icon: ScrollText,
      dot: true,
      activePattern: new RegExp(`^/servers/${currentServerId}/logs`),
    },
    {
      title: "Secrets (.env)",
      href: `/servers/${currentServerId}/secrets`,
      icon: KeyRound,
      activePattern: new RegExp(`^/servers/${currentServerId}/secrets`),
    },
    {
      title: "Settings",
      href: `/servers/${currentServerId}/settings`,
      icon: Sliders,
      activePattern: new RegExp(`^/servers/${currentServerId}/settings`),
    },
  ];

  const globalNavItems = [
    {
      title: "Tous les serveurs",
      href: "/servers",
      icon: Server,
      activePattern: /^\/servers$/,
    },
    {
      title: "Compte & API Keys",
      href: "/settings",
      icon: UserCheck,
      activePattern: /^\/settings/,
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-border/80 bg-card/60 backdrop-blur-md h-screen sticky top-0 px-4 py-5 overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-orange-400 text-white shadow-md shadow-orange-500/30">
            {/* Custom SVG logo resembling the mockup cloud/flame logo */}
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM13 14v4h-2v-4H8l4-4 4 4h-3z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground flex items-center gap-1">
              MCP <span className="text-primary font-black">Builder</span>
            </span>
          </div>
        </div>

        {/* Server Switcher Dropdown */}
        <div className="pt-1">
          <ServerSwitcher />
        </div>

        {/* Active Server Navigation */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>SERVEUR ACTIF:</span>
            {activeServer && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium lowercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                online
              </span>
            )}
          </div>

          <nav className="space-y-0.5">
            {serverNavItems.map((item) => {
              const isActive = item.activePattern.test(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all group",
                    isActive
                      ? "bg-primary text-white font-semibold shadow-xs shadow-orange-500/25"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-mono font-bold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.dot && (
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        isActive ? "bg-white animate-pulse" : "bg-emerald-500 animate-pulse"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Global Espace Navigation */}
        <div className="space-y-1 pt-2">
          <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            ESPACE:
          </div>

          <nav className="space-y-0.5">
            {globalNavItems.map((item) => {
              const isActive = item.activePattern.test(pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all group",
                    isActive
                      ? "bg-primary text-white font-semibold shadow-xs shadow-orange-500/25"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Footer: Light/Dark Switcher */}
      <div className="pt-6 border-t border-border/60 flex flex-col gap-3">
        <LightDarkToggle className="w-full justify-center" />
        <div className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1.5">
          <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
          <span>Fargate Cluster Connected</span>
        </div>
      </div>
    </aside>
  );
}

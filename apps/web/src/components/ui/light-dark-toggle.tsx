"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function LightDarkToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("flex items-center rounded-xl bg-muted/60 p-1 border border-border/60 w-fit", className)}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground">
          <Sun className="h-3.5 w-3.5" />
          <span>Light</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground">
          <Moon className="h-3.5 w-3.5" />
          <span>Dark</span>
        </div>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl bg-muted/70 p-1 border border-border/60 shadow-inner",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
          !isDark
            ? "bg-card text-foreground shadow-xs font-semibold border border-border/40"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Sun className={cn("h-3.5 w-3.5", !isDark ? "text-amber-500 fill-amber-500/20" : "")} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
          isDark
            ? "bg-card text-foreground shadow-xs font-semibold border border-border/40"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className={cn("h-3.5 w-3.5", isDark ? "text-blue-400 fill-blue-400/20" : "")} />
        <span>Dark</span>
      </button>
    </div>
  );
}

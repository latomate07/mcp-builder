"use client";

import React from "react";
import { ChevronRight, FileCode, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupabaseCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  onClick?: () => void;
  badge?: string;
  className?: string;
}

export function SupabaseCard({
  title,
  description,
  icon,
  actionLabel = "Preview",
  actionIcon = <Eye className="h-3.5 w-3.5 text-zinc-400" />,
  onAction,
  onClick,
  badge,
  className,
}: SupabaseCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-[#262626] bg-[#171717] p-5 shadow-xs transition-all duration-150 hover:border-zinc-700 hover:bg-[#1a1a1a]",
        onClick ? "cursor-pointer" : "",
        className
      )}
    >
      <div className="space-y-3">
        {/* Top line: Icon + Title + Chevron */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2e2e2e] bg-[#121212] text-zinc-300 group-hover:text-white transition-colors">
              {icon || <FileCode className="h-4 w-4" />}
            </div>
            <div className="flex items-center gap-2 truncate">
              <h3 className="text-sm font-medium text-white truncate">
                {title}
              </h3>
              {badge && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {badge}
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Bottom Action Button (matching the Preview button in the screenshot) */}
      <div className="pt-4 mt-2">
        <button
          type="button"
          onClick={(e) => {
            if (onAction) {
              e.stopPropagation();
              onAction();
            }
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#2e2e2e] bg-[#202020] hover:bg-[#282828] hover:border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 font-medium transition-all active:scale-[0.99]"
        >
          {actionIcon}
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}

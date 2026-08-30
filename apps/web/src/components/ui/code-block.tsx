"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "json",
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/80 bg-slate-950 text-slate-100 font-mono text-xs overflow-hidden shadow-xs",
        className
      )}
    >
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs">
          <span className="font-sans font-medium flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            {filename}
          </span>
          <span className="uppercase text-[10px] tracking-wider text-slate-500 font-semibold">
            {language}
          </span>
        </div>
      )}

      <button
        onClick={onCopy}
        type="button"
        aria-label="Copier le code"
        className="absolute right-3 top-3 z-10 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all active:scale-95 border border-slate-700/60"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>

      <div className="p-4 overflow-x-auto">
        <pre className="flex">
          {showLineNumbers && (
            <div className="select-none pr-4 text-slate-600 text-right border-r border-slate-800/80 mr-4 font-mono">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code className="text-slate-200 leading-relaxed font-mono">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

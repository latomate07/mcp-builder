import React from "react";
import { cn } from "@/lib/utils";

export type DogLogoConcept = "cyber-dog" | "hound-profile" | "minimal-dog";

interface McpLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  concept?: DogLogoConcept;
  withText?: boolean;
}

export function McpLogo({
  className,
  size = "md",
  concept = "cyber-dog",
  withText = false,
}: McpLogoProps) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-7 w-7",
    lg: "h-9 w-9",
    xl: "h-11 w-11",
  };

  const renderDogIcon = () => {
    switch (concept) {
      case "cyber-dog":
        // Concept 1: Modern Geometric Low-Poly Cyber Dog (Shiba / Doberman Tech Mascot)
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4/5 w-4/5"
          >
            {/* Left Ear */}
            <path
              d="M4.5 3.2L8.2 9.5L3 8.5L4.5 3.2Z"
              fill="#3ECF8E"
              fillOpacity="0.9"
            />
            {/* Right Ear */}
            <path
              d="M19.5 3.2L15.8 9.5L21 8.5L19.5 3.2Z"
              fill="#3ECF8E"
              fillOpacity="0.9"
            />
            {/* Forehead / Brow */}
            <path
              d="M8.2 9.5L12 11.2L15.8 9.5L12 6.8L8.2 9.5Z"
              fill="#24B47E"
            />
            {/* Left Cheek */}
            <path
              d="M3 8.5L8.2 9.5L8.5 15.2L4.2 14.5L3 8.5Z"
              fill="#1EA76B"
              fillOpacity="0.75"
            />
            {/* Right Cheek */}
            <path
              d="M21 8.5L15.8 9.5L15.5 15.2L19.8 14.5L21 8.5Z"
              fill="#1EA76B"
              fillOpacity="0.75"
            />
            {/* Snout Center & Bridge */}
            <path
              d="M8.2 9.5L12 11.2L15.8 9.5L15.5 15.2L12 18.5L8.5 15.2L8.2 9.5Z"
              fill="url(#snout-gradient)"
            />
            {/* Nose */}
            <path
              d="M10.8 16.5L12 18L13.2 16.5H10.8Z"
              fill="#ffffff"
            />
            {/* Cyber Eyes */}
            <circle cx="8.8" cy="11.8" r="1.1" fill="#ffffff" />
            <circle cx="15.2" cy="11.8" r="1.1" fill="#ffffff" />

            <defs>
              <linearGradient
                id="snout-gradient"
                x1="8.2"
                y1="9.5"
                x2="15.8"
                y2="18.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3ECF8E" />
                <stop offset="1" stopColor="#178854" />
              </linearGradient>
            </defs>
          </svg>
        );

      case "hound-profile":
        // Concept 2: Sleek Minimalist Dog Profile (Fetch / Guard Dog)
        return (
          <svg viewBox="0 0 24 24" fill="none" className="h-4/5 w-4/5 text-[#3ECF8E]">
            <path
              d="M4 19L5.5 13L9 11L14 4L17 5L15 10L20 12L19.5 15L16 15.5L13 20H4V19Z"
              fill="currentColor"
              fillOpacity="0.85"
            />
            <circle cx="13" cy="9" r="1.2" fill="#000000" />
            <circle cx="18" cy="13.2" r="0.8" fill="#ffffff" />
          </svg>
        );

      case "minimal-dog":
        // Concept 3: Line-Art Modern Dog (Clean Devtool Badge)
        return (
          <svg viewBox="0 0 24 24" fill="none" className="h-4/5 w-4/5 text-white">
            {/* Ears */}
            <path d="M5 4L8 10M19 4L16 10" stroke="#3ECF8E" strokeWidth="2" strokeLinecap="round" />
            {/* Face outline */}
            <path
              d="M5 8C4 13 6 18 12 20C18 18 20 13 19 8C16 9 8 9 5 8Z"
              stroke="#3ECF8E"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Nose & Mouth */}
            <circle cx="9" cy="12" r="1.2" fill="#3ECF8E" />
            <circle cx="15" cy="12" r="1.2" fill="#3ECF8E" />
            <polygon points="11,15 13,15 12,16.5" fill="#3ECF8E" />
          </svg>
        );
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg border border-[#2e2e2e] bg-[#171717] transition-all duration-150 hover:border-emerald-500/60 hover:scale-105 shadow-xs group",
          sizeMap[size]
        )}
      >
        {renderDogIcon()}
      </div>

      {withText && (
        <div className="flex items-center gap-1.5 font-sans">
          <span className="font-bold tracking-tight text-white text-sm">
            MCP
          </span>
          <span className="font-light tracking-tight text-emerald-400 text-sm">
            Hound
          </span>
        </div>
      )}
    </div>
  );
}

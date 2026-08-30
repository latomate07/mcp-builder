import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground border border-border",
        active:
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium",
        deploying:
          "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-medium",
        error:
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium",
        stopped:
          "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-medium",
        verified:
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium",
        unverified:
          "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-medium",
        get: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono text-[10px] font-bold uppercase",
        post: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold uppercase",
        put: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono text-[10px] font-bold uppercase",
        delete: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono text-[10px] font-bold uppercase",
        code: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-mono text-[10px] font-bold uppercase",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "active" && "bg-emerald-500 animate-pulse",
            variant === "deploying" && "bg-sky-500 animate-ping",
            variant === "error" && "bg-rose-500",
            variant === "stopped" && "bg-slate-400"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

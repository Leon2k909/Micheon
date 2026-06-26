import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "orange" | "amber" | "emerald" | "outline" | "teal";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { variant?: BadgeVariant; }

const variants: Record<BadgeVariant, string> = {
  default:  "bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]",
  outline:  "bg-transparent text-[var(--text-3)] border-[var(--border)]",
  accent:   "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-dim)]",
  teal:     "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent-dim)]",
  orange:   "bg-orange-500/10 text-orange-500 border-orange-500/20",
  amber:    "bg-amber-400/10 text-amber-600 border-amber-400/20",
  emerald:  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

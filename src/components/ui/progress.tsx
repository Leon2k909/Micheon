import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "teal" | "orange" | "emerald" | "rose";
  size?: "sm" | "default" | "lg";
}

const fills: Record<string, string> = {
  default: "bg-[var(--text-3)]",
  teal:    "bg-[var(--accent)]",
  orange:  "bg-orange-400",
  emerald: "bg-emerald-400",
  rose:    "bg-rose-400",
};

const heights: Record<string, string> = {
  sm: "h-1", default: "h-1.5", lg: "h-2",
};

export function Progress({ className, value, variant = "teal", size = "default", ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative w-full overflow-hidden rounded-full bg-[var(--border)]", heights[size], className)}
      {...props}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.div
          animate={{ width: `${value ?? 0}%` }}
          className={cn("h-full rounded-full", fills[variant ?? "teal"])}
          initial={{ width: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
}

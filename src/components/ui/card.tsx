import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated" | "glow" | "hero";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        variant === "glass" && "rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/95 shadow-[0_18px_45px_var(--shadow)] backdrop-blur-xl",
        variant === "elevated" && "rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_var(--shadow-strong)]",
        variant === "glow" && "rounded-[24px] border border-[var(--accent)]/20 bg-[var(--surface)] shadow-[0_24px_60px_rgba(120,52,247,0.12)]",
        variant === "hero" && "rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_28px_70px_var(--shadow-strong)]",
        variant === "default" && "rounded-[24px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_18px_45px_var(--shadow)]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-7 pb-0 sm:p-8 sm:pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-black tracking-tight text-[var(--text-1)]", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm font-semibold leading-6 text-[var(--text-3)]", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-7 pt-6 sm:p-8 sm:pt-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };

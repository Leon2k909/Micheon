import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        default:  "accent-btn px-5 h-10",
        primary:  "accent-btn px-5 h-10",
        secondary:"ghost-btn px-5 h-10",
        ghost:    "bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)] rounded-[10px] px-4 h-10 border-0",
        outline:  "ghost-btn px-5 h-10",
        destructive: "bg-rose-500/90 text-white rounded-[10px] px-5 h-10 hover:bg-rose-500 active:scale-[0.98]",
        success:  "bg-emerald-500/90 text-[#0a1f0d] font-semibold rounded-[10px] px-5 h-10 hover:bg-emerald-400 active:scale-[0.98]",
      },
      size: {
        default: "",
        sm:  "h-8 px-3 text-xs rounded-[8px]",
        lg:  "h-11 px-6 text-sm rounded-[12px]",
        xl:  "h-12 px-7 text-base rounded-[12px]",
        icon:"h-9 w-9 p-0 rounded-[10px]",
        "icon-sm": "h-8 w-8 p-0 rounded-[8px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

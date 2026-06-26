import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[15px] font-semibold text-[var(--text-1)] transition-[border-color,background-color,box-shadow,color] duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-3)] focus-visible:border-[var(--accent)] focus-visible:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--accent)_16%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

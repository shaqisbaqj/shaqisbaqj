import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-emerald-600 text-paper-50 hover:bg-emerald-500 disabled:bg-emerald-800",
  secondary:
    "bg-ink-800 text-paper-100 border border-ink-700 hover:bg-ink-700",
  ghost: "text-paper-400 hover:text-paper-50 hover:bg-ink-800",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-DEFAULT px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";

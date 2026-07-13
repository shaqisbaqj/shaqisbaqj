import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-ink-700 bg-ink-900/60 p-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardLabel({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.14em] text-paper-600",
        className,
      )}
      {...props}
    />
  );
}

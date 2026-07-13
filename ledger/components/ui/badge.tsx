import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "emerald" | "amber" | "red" | "neutral";

const tones: Record<Tone, string> = {
  emerald: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  amber: "bg-amber-900/30 text-amber-300 border-amber-700/40",
  red: "bg-red-900/30 text-red-300 border-red-700/40",
  neutral: "bg-ink-800 text-paper-400 border-ink-700",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

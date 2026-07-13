import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  tone = "emerald",
}: {
  value: number; // 0-100
  className?: string;
  tone?: "emerald" | "amber" | "red";
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const toneClass = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  }[tone];

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-800", className)}>
      <div
        className={cn("h-full rounded-full transition-all", toneClass)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

import { cn } from "@/lib/utils";

export function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}) {
  const isUser = role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75ch] whitespace-pre-wrap rounded-lg px-4 py-3 text-[15px] leading-relaxed",
          isUser
            ? "bg-emerald-700/90 text-paper-50"
            : "border border-ink-700 bg-ink-900/60 text-paper-100",
        )}
      >
        {content}
        {streaming && (
          <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse-dot bg-emerald-400" />
        )}
      </div>
    </div>
  );
}

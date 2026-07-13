"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { MessageBubble } from "@/components/chat/message-bubble";
import type { ChatMessage } from "@/types/database";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Can we afford a $200/mo daycare increase?",
  "Are we on pace for our savings goal?",
  "What's our fastest way out of the Chase Sapphire balance?",
  "What does the next two weeks look like for cash flow?",
];

export function ChatWindow({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState<DisplayMessage[]>(
    initialMessages.map((m) => ({ id: m.id, role: m.role, content: m.content })),
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setInput("");
    setSending(true);

    const userMsg: DisplayMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.body) throw new Error("No response stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Couldn't reach Ledger. Check your connection and try again." }
            : m,
        ),
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col gap-3 pt-8">
              <p className="text-paper-400">
                Ask Ledger anything about your money. It has the full picture — real numbers, no
                generic advice.
              </p>
              <div className="flex flex-col gap-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="w-fit rounded-DEFAULT border border-ink-700 bg-ink-900/60 px-3 py-2 text-left text-sm text-paper-300 hover:border-emerald-700/50 hover:text-paper-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              role={m.role}
              content={m.content}
              streaming={sending && i === messages.length - 1 && m.role === "assistant"}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-ink-800 p-3 lg:p-4"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask about your money…"
            rows={1}
            className="max-h-40 flex-1 resize-none rounded-DEFAULT border border-ink-700 bg-ink-900 px-3 py-2.5 text-[15px] text-paper-100 placeholder:text-paper-600 focus:border-emerald-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-DEFAULT bg-emerald-600 text-paper-50 hover:bg-emerald-500 disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

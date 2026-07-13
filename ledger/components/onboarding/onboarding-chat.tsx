"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, Check } from "lucide-react";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Button } from "@/components/ui/button";

interface Turn {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function OnboardingChat({ alreadyComplete }: { alreadyComplete: boolean }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(alreadyComplete);
  const scrollRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (started.current || alreadyComplete) return;
    started.current = true;
    turn("__start__");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function turn(message: string) {
    setLoading(true);
    if (message !== "__start__") {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: message }]);
    }
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: data.reply }]);
      if (data.complete) setComplete(true);
    } finally {
      setLoading(false);
    }
  }

  if (alreadyComplete && complete) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-ink-950 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/60 text-emerald-400">
          <Check size={22} />
        </div>
        <h1 className="text-xl font-medium text-paper-50">Your profile&apos;s already built.</h1>
        <p className="max-w-sm text-sm text-paper-400">
          You can update anything — income, goals, what&apos;s keeping you up at night — anytime by
          just telling Ledger in chat.
        </p>
        <Button onClick={() => router.push("/chat")}>Go to chat</Button>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-ink-950">
      <header className="border-b border-ink-800 px-4 py-3">
        <span className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">Ledger</span>
        <p className="mt-1 text-sm text-paper-500">
          A few questions, like a financial advisor would ask — not a form.
        </p>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role} content={m.content} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3">
                <span className="inline-block h-2 w-2 animate-pulse-dot rounded-full bg-emerald-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {complete ? (
        <div className="border-t border-ink-800 p-4">
          <div className="mx-auto flex max-w-2xl justify-end">
            <Button onClick={() => router.push("/chat")}>
              <Check size={16} />
              Go to your dashboard
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim() || loading) return;
            const text = input;
            setInput("");
            turn(text);
          }}
          className="border-t border-ink-800 p-3"
        >
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
                }
              }}
              placeholder="Type your answer…"
              rows={1}
              disabled={loading}
              className="max-h-40 flex-1 resize-none rounded-DEFAULT border border-ink-700 bg-ink-900 px-3 py-2.5 text-[15px] text-paper-100 placeholder:text-paper-600 focus:border-emerald-600 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-DEFAULT bg-emerald-600 text-paper-50 hover:bg-emerald-500 disabled:opacity-40"
              aria-label="Send"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

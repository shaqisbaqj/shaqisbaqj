"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoalCreateForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't create that goal");
      setText("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder='Save $5k before July…'
          disabled={busy}
          className="flex-1 rounded-DEFAULT border border-ink-700 bg-ink-900 px-3 py-2.5 text-[15px] text-paper-100 placeholder:text-paper-600 focus:border-emerald-600 focus:outline-none disabled:opacity-50"
        />
        <Button onClick={submit} disabled={busy || !text.trim()}>
          <Plus size={16} />
          {busy ? "Adding…" : "Add goal"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

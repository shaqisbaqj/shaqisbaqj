"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { goalPace } from "@/lib/goal-pace";
import type { Goal } from "@/types/database";

export function GoalCard({ goal }: { goal: Goal }) {
  const router = useRouter();
  const [amount, setAmount] = useState(String(goal.current_amount));
  const [busy, setBusy] = useState(false);

  const pace = goalPace(goal);
  const pct = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;

  async function updateAmount() {
    const value = Number(amount);
    if (Number.isNaN(value) || busy) return;
    setBusy(true);
    try {
      await fetch(`/api/goals/${goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_amount: value }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await fetch(`/api/goals/${goal.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-paper-50">{goal.name}</p>
          {goal.target_date && (
            <p className="text-xs text-paper-600">Target: {formatDate(goal.target_date, { year: "numeric" })}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={pace.onPace ? "emerald" : "amber"}>{pace.label}</Badge>
          <button
            onClick={remove}
            disabled={busy}
            className="text-paper-600 hover:text-red-400 disabled:opacity-50"
            aria-label="Remove goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <ProgressBar value={pct} tone={pace.onPace ? "emerald" : "amber"} />

      <div className="flex items-center justify-between text-sm">
        <span className="tabular-nums text-paper-300">
          {formatCurrency(goal.current_amount)} of {formatCurrency(goal.target_amount)}
        </span>
        <span className="tabular-nums text-paper-600">{Math.round(pct)}%</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={updateAmount}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          inputMode="decimal"
          className="w-28 rounded-sm border border-ink-700 bg-ink-800 px-2 py-1 text-sm tabular-nums text-paper-100 focus:border-emerald-600 focus:outline-none"
        />
        <span className="text-xs text-paper-600">update saved amount</span>
      </div>
    </Card>
  );
}

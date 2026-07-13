import Link from "next/link";
import { Card, CardLabel } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { goalPace } from "@/lib/goal-pace";
import type { Goal, CashFlowEvent } from "@/types/database";

export function RightRail({ goals, bills }: { goals: Goal[]; bills: CashFlowEvent[] }) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <CardLabel>Active goals</CardLabel>
          <Link href="/goals" className="text-xs text-emerald-400 hover:underline">
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {goals.length === 0 && (
            <p className="px-1 text-sm text-paper-600">No goals yet — tell Ledger what you&rsquo;re saving for.</p>
          )}
          {goals.slice(0, 3).map((g) => {
            const pace = goalPace(g);
            const pct = g.target_amount > 0 ? (g.current_amount / g.target_amount) * 100 : 0;
            return (
              <Card key={g.id} className="p-3">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-paper-100">{g.name}</p>
                  <span
                    className={
                      "text-xs " + (pace.onPace ? "text-emerald-400" : "text-amber-400")
                    }
                  >
                    {pace.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-paper-600 tabular-nums">
                  {formatCurrency(g.current_amount)} / {formatCurrency(g.target_amount)}
                </p>
                <ProgressBar value={pct} className="mt-2" tone={pace.onPace ? "emerald" : "amber"} />
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between px-1">
          <CardLabel>Upcoming bills</CardLabel>
          <Link href="/cashflow" className="text-xs text-emerald-400 hover:underline">
            Calendar
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          {bills.length === 0 && (
            <p className="px-1 text-sm text-paper-600">Nothing due — you&rsquo;re clear for now.</p>
          )}
          {bills.slice(0, 6).map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-ink-800/60">
              <div className="min-w-0">
                <p className="truncate text-paper-200">{b.name}</p>
                <p className="text-xs text-paper-600">{formatDate(b.event_date)}</p>
              </div>
              <span className="tabular-nums text-paper-100">{formatCurrency(Math.abs(b.amount))}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

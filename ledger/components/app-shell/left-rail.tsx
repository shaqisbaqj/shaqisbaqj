import { Card, CardLabel } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/dashboard-data";

export function LeftRail({ summary }: { summary: DashboardSummary }) {
  const cashFlowNet = summary.monthlyIncome - summary.monthlyBills;

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      <div className="mb-1 px-1">
        <span className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">
          Ledger
        </span>
      </div>

      <Card>
        <CardLabel>Net worth</CardLabel>
        <p className="mt-1 text-2xl font-medium tabular-nums text-paper-50">
          {formatCurrency(summary.netWorth)}
        </p>
      </Card>

      <Card>
        <CardLabel>Cash flow / mo</CardLabel>
        <p
          className={
            "mt-1 text-2xl font-medium tabular-nums " +
            (cashFlowNet >= 0 ? "text-emerald-400" : "text-red-400")
          }
        >
          {formatCurrency(cashFlowNet, { signed: true })}
        </p>
        <p className="mt-1 text-xs text-paper-600">
          {formatCurrency(summary.monthlyIncome)} in · {formatCurrency(summary.monthlyBills)} out
        </p>
      </Card>

      <Card>
        <CardLabel>Total debt</CardLabel>
        <p className="mt-1 text-2xl font-medium tabular-nums text-paper-50">
          {formatCurrency(summary.debtTotal)}
        </p>
      </Card>

      <div className="mt-2 flex flex-col gap-1">
        <CardLabel className="px-1">Accounts</CardLabel>
        {summary.accounts.length === 0 && (
          <p className="px-1 text-sm text-paper-600">No accounts linked yet.</p>
        )}
        {summary.accounts.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-ink-800/60"
          >
            <span className="truncate text-paper-200">{a.name}</span>
            <span className={"tabular-nums " + (a.is_debt ? "text-red-300" : "text-paper-100")}>
              {formatCurrency(Number(a.current_balance ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

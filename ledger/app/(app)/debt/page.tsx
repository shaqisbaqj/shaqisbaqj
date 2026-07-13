import { getOrCreateHouseholdId } from "@/lib/household";
import { getDashboardSummary } from "@/lib/dashboard-data";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { recommendStrategy } from "@/lib/debt-strategy";
import { Card, CardLabel } from "@/components/ui/card";
import { DebtTimeline } from "@/components/debt/debt-timeline";
import { formatCurrency } from "@/lib/utils";
import type { Debt } from "@/types/database";

export default async function DebtPage() {
  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const [{ data: debtsData }, summary] = await Promise.all([
    db.from("debts").select("*").eq("household_id", householdId).order("apr", { ascending: false }),
    getDashboardSummary(householdId),
  ]);

  const debts = (debtsData ?? []) as Debt[];
  const minimumTotal = debts.reduce((sum, d) => sum + Number(d.minimum_payment), 0);
  const surplus = Math.max(summary.monthlyIncome - summary.monthlyBills, 0);

  if (debts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <h1 className="text-xl font-medium text-paper-50">Debt War Room</h1>
        <p className="mt-3 text-sm text-paper-500">
          No debt on file. Once you link accounts or tell Ledger about a loan or card, it shows up
          here with a payoff timeline and a strategy.
        </p>
      </div>
    );
  }

  const { avalanche, snowball, recommended } = recommendStrategy(debts, surplus);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <h1 className="text-xl font-medium text-paper-50">Debt War Room</h1>
      <p className="mt-1 text-sm text-paper-500">
        Every balance, one payoff strategy, and where you actually stand.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Card>
          <CardLabel>Total debt</CardLabel>
          <p className="mt-1 text-xl font-medium tabular-nums text-paper-50">
            {formatCurrency(debts.reduce((s, d) => s + Number(d.balance), 0))}
          </p>
        </Card>
        <Card>
          <CardLabel>Minimums / mo</CardLabel>
          <p className="mt-1 text-xl font-medium tabular-nums text-paper-50">
            {formatCurrency(minimumTotal)}
          </p>
        </Card>
        <Card>
          <CardLabel>Extra budget / mo</CardLabel>
          <p className="mt-1 text-xl font-medium tabular-nums text-emerald-400">
            {formatCurrency(surplus)}
          </p>
        </Card>
      </div>

      <div className="mt-8">
        <CardLabel className="mb-3">All debts</CardLabel>
        <div className="flex flex-col gap-2">
          {debts.map((d) => (
            <Card key={d.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-paper-100">{d.name}</p>
                <p className="text-xs text-paper-600">
                  {d.apr}% APR · {formatCurrency(Number(d.minimum_payment))}/mo min
                </p>
              </div>
              <p className="tabular-nums text-paper-50">{formatCurrency(Number(d.balance))}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <DebtTimeline plan={avalanche} recommended={recommended === "avalanche"} />
        <DebtTimeline plan={snowball} recommended={recommended === "snowball"} />
      </div>
    </div>
  );
}

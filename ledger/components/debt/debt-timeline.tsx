import { Card, CardLabel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { monthsToDate, type PayoffPlan } from "@/lib/debt-strategy";

export function DebtTimeline({ plan, recommended }: { plan: PayoffPlan; recommended: boolean }) {
  return (
    <Card className={recommended ? "border-emerald-700/50" : undefined}>
      <div className="flex items-center justify-between">
        <div>
          <CardLabel>{plan.strategy === "avalanche" ? "Avalanche" : "Snowball"} strategy</CardLabel>
          <p className="mt-1 text-sm text-paper-500">
            {plan.strategy === "avalanche"
              ? "Highest interest rate first — minimizes what you pay overall."
              : "Smallest balance first — fastest first win."}
          </p>
        </div>
        {recommended && <Badge tone="emerald">Recommended</Badge>}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <CardLabel>Debt-free by</CardLabel>
          <p className="mt-1 text-lg font-medium text-paper-50">{monthsToDate(plan.totalMonths)}</p>
        </div>
        <div>
          <CardLabel>Total interest paid</CardLabel>
          <p className="mt-1 text-lg font-medium text-paper-50">{formatCurrency(plan.totalInterestPaid)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {plan.order.map((step, i) => (
          <div key={step.debtId} className="flex items-center justify-between text-sm">
            <span className="text-paper-300">
              {i + 1}. {step.name}
            </span>
            <span className="tabular-nums text-paper-600">{monthsToDate(step.monthsToPayoff)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

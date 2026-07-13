import type { Debt } from "@/types/database";

export type StrategyId = "avalanche" | "snowball";

export interface PayoffStep {
  debtId: string;
  name: string;
  monthsToPayoff: number;
  interestPaid: number;
}

export interface PayoffPlan {
  strategy: StrategyId;
  totalMonths: number;
  totalInterestPaid: number;
  order: PayoffStep[];
}

/**
 * Avalanche = highest APR first (minimizes interest paid).
 * Snowball  = smallest balance first (fastest first win, for momentum).
 * Both simulate paying every debt's minimum, plus rolling all freed-up
 * minimum + the extra monthly budget onto the current target debt.
 */
export function simulatePayoff(
  debts: Debt[],
  extraMonthlyBudget: number,
  strategy: StrategyId,
): PayoffPlan {
  const ordered = [...debts].sort((a, b) =>
    strategy === "avalanche" ? b.apr - a.apr : a.balance - b.balance,
  );

  const balances = new Map(ordered.map((d) => [d.id, d.balance]));
  const interestPaid = new Map(ordered.map((d) => [d.id, 0]));
  const payoffMonth = new Map<string, number>();

  let month = 0;
  let extra = Math.max(extraMonthlyBudget, 0);
  const active = new Set(ordered.map((d) => d.id));
  const maxMonths = 600; // 50-year safety cap against pathological inputs

  while (active.size > 0 && month < maxMonths) {
    month += 1;
    let freedUp = 0;

    for (const debt of ordered) {
      if (!active.has(debt.id)) continue;
      const balance = balances.get(debt.id)!;
      const monthlyRate = debt.apr / 100 / 12;
      const interest = balance * monthlyRate;
      balances.set(debt.id, balance + interest);
      interestPaid.set(debt.id, interestPaid.get(debt.id)! + interest);
    }

    let available = extra;
    for (const debt of ordered) {
      if (!active.has(debt.id)) continue;
      const payment = Math.min(Number(debt.minimum_payment), balances.get(debt.id)!);
      balances.set(debt.id, balances.get(debt.id)! - payment);
    }

    for (const debt of ordered) {
      if (!active.has(debt.id)) continue;
      const balance = balances.get(debt.id)!;
      if (balance <= 0) continue;
      const payment = Math.min(available, balance);
      balances.set(debt.id, balance - payment);
      available -= payment;
      if (available <= 0) break;
    }

    for (const debt of ordered) {
      if (active.has(debt.id) && balances.get(debt.id)! <= 0.01) {
        active.delete(debt.id);
        payoffMonth.set(debt.id, month);
        freedUp += Number(debt.minimum_payment);
      }
    }
    extra += freedUp;
  }

  const order: PayoffStep[] = ordered.map((d) => ({
    debtId: d.id,
    name: d.name,
    monthsToPayoff: payoffMonth.get(d.id) ?? month,
    interestPaid: Math.round((interestPaid.get(d.id) ?? 0) * 100) / 100,
  }));

  return {
    strategy,
    totalMonths: Math.max(...order.map((o) => o.monthsToPayoff), 0),
    totalInterestPaid: Math.round(order.reduce((sum, o) => sum + o.interestPaid, 0) * 100) / 100,
    order,
  };
}

export function recommendStrategy(
  debts: Debt[],
  extraMonthlyBudget: number,
): { avalanche: PayoffPlan; snowball: PayoffPlan; recommended: StrategyId } {
  const avalanche = simulatePayoff(debts, extraMonthlyBudget, "avalanche");
  const snowball = simulatePayoff(debts, extraMonthlyBudget, "snowball");

  const interestGap = snowball.totalInterestPaid - avalanche.totalInterestPaid;
  // Avalanche always saves the most interest; only defer to snowball when
  // the cost of doing so is negligible and it clears a debt meaningfully sooner.
  const firstPayoffGap =
    (avalanche.order[0]?.monthsToPayoff ?? 0) - (snowball.order[0]?.monthsToPayoff ?? 0);
  const recommended: StrategyId =
    interestGap < 50 && firstPayoffGap >= 2 ? "snowball" : "avalanche";

  return { avalanche, snowball, recommended };
}

export function monthsToDate(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

import type { Goal } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

export interface GoalPace {
  onPace: boolean;
  label: string;
  weeklyAmountNeeded: number | null;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * "Tracks it, tells you if you're on pace, flags when you're not" — this is
 * that logic. Expected progress is a straight line from goal creation to
 * target date; behind that line by more than a 10% cushion counts as
 * off-pace.
 */
export function goalPace(goal: Goal): GoalPace {
  const remaining = goal.target_amount - goal.current_amount;

  if (remaining <= 0) {
    return { onPace: true, label: "Achieved", weeklyAmountNeeded: 0 };
  }
  if (!goal.target_date) {
    return { onPace: true, label: "No deadline", weeklyAmountNeeded: null };
  }

  const now = Date.now();
  const target = new Date(goal.target_date).getTime();
  const created = new Date(goal.created_at).getTime();

  const weeksRemaining = Math.max((target - now) / WEEK_MS, 1 / 7);
  const weeklyAmountNeeded = remaining / weeksRemaining;

  if (target <= now) {
    return { onPace: false, label: "Past due", weeklyAmountNeeded };
  }

  const totalSpan = Math.max(target - created, 1);
  const elapsed = Math.max(now - created, 0);
  const expectedProgress = goal.target_amount * (elapsed / totalSpan);
  const onPace = goal.current_amount >= expectedProgress * 0.9;

  return {
    onPace,
    label: onPace
      ? `On pace`
      : `Need ${formatCurrency(weeklyAmountNeeded)}/wk`,
    weeklyAmountNeeded,
  };
}

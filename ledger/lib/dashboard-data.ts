import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Account, CashFlowEvent, Goal } from "@/types/database";

export interface DashboardSummary {
  netWorth: number;
  assetTotal: number;
  debtTotal: number;
  monthlyIncome: number;
  monthlyBills: number;
  goals: Goal[];
  upcomingBills: CashFlowEvent[];
  accounts: Account[];
}

/** Server-side rollups that feed the left/right rails on every page. */
export async function getDashboardSummary(householdId: string): Promise<DashboardSummary> {
  const db = createAdminSupabaseClient();

  const [accountsRes, goalsRes, eventsRes] = await Promise.all([
    db.from("accounts").select("*").eq("household_id", householdId),
    db
      .from("goals")
      .select("*")
      .eq("household_id", householdId)
      .eq("status", "active")
      .order("target_date", { ascending: true }),
    db
      .from("cash_flow_events")
      .select("*")
      .eq("household_id", householdId)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(8),
  ]);

  const accounts = (accountsRes.data ?? []) as Account[];
  const goals = (goalsRes.data ?? []) as Goal[];
  const upcomingBills = ((eventsRes.data ?? []) as CashFlowEvent[]).filter((e) => e.amount < 0);

  const assetTotal = accounts
    .filter((a) => !a.is_debt)
    .reduce((sum, a) => sum + Number(a.current_balance ?? 0), 0);
  const debtTotal = accounts
    .filter((a) => a.is_debt)
    .reduce((sum, a) => sum + Number(a.current_balance ?? 0), 0);

  const monthEvents = await db
    .from("cash_flow_events")
    .select("amount")
    .eq("household_id", householdId);
  const monthlyIncome = (monthEvents.data ?? [])
    .filter((e) => Number(e.amount) > 0)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const monthlyBills = (monthEvents.data ?? [])
    .filter((e) => Number(e.amount) < 0)
    .reduce((sum, e) => sum + Math.abs(Number(e.amount)), 0);

  return {
    netWorth: assetTotal - debtTotal,
    assetTotal,
    debtTotal,
    monthlyIncome,
    monthlyBills,
    goals,
    upcomingBills,
    accounts,
  };
}

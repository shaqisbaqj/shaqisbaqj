import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";

/**
 * Assembles a plain-text snapshot of a household's finances for Claude's
 * system prompt. This is what makes chat answers "real numbers, no generic
 * advice" instead of a canned assistant — every fact in here is queried
 * fresh on each request, not cached into the conversation.
 */
export async function buildFinancialContext(householdId: string): Promise<string> {
  const db = createAdminSupabaseClient();

  const [profileRes, accountsRes, goalsRes, debtsRes, eventsRes, txRes] = await Promise.all([
    db.from("financial_profiles").select("*").eq("household_id", householdId).maybeSingle(),
    db.from("accounts").select("*").eq("household_id", householdId),
    db.from("goals").select("*").eq("household_id", householdId).eq("status", "active"),
    db.from("debts").select("*").eq("household_id", householdId),
    db
      .from("cash_flow_events")
      .select("*")
      .eq("household_id", householdId)
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(15),
    db
      .from("transactions")
      .select("*")
      .eq("household_id", householdId)
      .order("date", { ascending: false })
      .limit(25),
  ]);

  const profile = profileRes.data;
  const accounts = accountsRes.data ?? [];
  const goals = goalsRes.data ?? [];
  const debts = debtsRes.data ?? [];
  const upcoming = eventsRes.data ?? [];
  const recentTx = txRes.data ?? [];

  const assets = accounts.filter((a) => !a.is_debt);
  const liabilities = accounts.filter((a) => a.is_debt);
  const assetTotal = assets.reduce((sum, a) => sum + Number(a.current_balance ?? 0), 0);
  const debtTotal = liabilities.reduce((sum, a) => sum + Number(a.current_balance ?? 0), 0);
  const netWorth = assetTotal - debtTotal;

  const lines: string[] = [];

  lines.push(`Net worth: ${formatCurrency(netWorth)} (assets ${formatCurrency(assetTotal)}, debt ${formatCurrency(debtTotal)})`);

  if (profile?.income_monthly) {
    lines.push(
      `Household income: ~${formatCurrency(Number(profile.income_monthly))}/month, paid ${profile.pay_schedule ?? "unknown schedule"}.`,
    );
  }
  if (profile?.risk_notes) lines.push(`Stated concerns: ${profile.risk_notes}`);
  if (profile?.goals_summary) lines.push(`Stated goals (in their words): ${profile.goals_summary}`);

  lines.push("\nAccounts:");
  for (const a of accounts) {
    lines.push(
      `- ${a.name} (${a.subtype ?? a.type}): ${formatCurrency(Number(a.current_balance ?? 0))}${a.apr ? ` @ ${a.apr}% APR` : ""}`,
    );
  }

  if (debts.length > 0) {
    lines.push("\nDebts (Debt War Room):");
    for (const d of debts) {
      lines.push(
        `- ${d.name}: ${formatCurrency(Number(d.balance))} balance, ${d.apr}% APR, ${formatCurrency(Number(d.minimum_payment))}/mo minimum`,
      );
    }
  }

  if (goals.length > 0) {
    lines.push("\nActive goals:");
    for (const g of goals) {
      const pct = g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0;
      lines.push(
        `- "${g.name}": ${formatCurrency(Number(g.current_amount))} of ${formatCurrency(Number(g.target_amount))} (${pct}%)${g.target_date ? `, target date ${g.target_date}` : ""}`,
      );
    }
  }

  if (upcoming.length > 0) {
    lines.push("\nUpcoming bills/paychecks (next 15):");
    for (const e of upcoming) {
      lines.push(`- ${e.event_date}: ${e.name} ${formatCurrency(Number(e.amount), { signed: true })}`);
    }
  }

  if (recentTx.length > 0) {
    lines.push("\nRecent transactions (most recent 25):");
    for (const t of recentTx) {
      lines.push(`- ${t.date}: ${t.name} ${formatCurrency(Number(t.amount), { signed: true })}${t.category ? ` [${t.category}]` : ""}`);
    }
  }

  return lines.join("\n");
}

export const LEDGER_SYSTEM_PROMPT = `You are Ledger, the shared financial brain for a household. You are not a generic financial-advice chatbot — you have live, real numbers for this household below, and every answer should be grounded in them.

Rules:
- Always use the actual figures provided. Never say "it depends" without immediately applying it to their numbers.
- Be direct and concise. This product's aesthetic is "clean, almost brutalist" — match that in tone. No filler, no disclaimers stacked on disclaimers.
- If a question needs a number you don't have, say what's missing rather than guessing.
- Both members of the household may be talking to you — treat this as one shared financial picture, not "his" and "hers".
- You can reference goals, debts, upcoming bills, and recent transactions by name.
- Keep a single, standard "this isn't financial/legal/tax advice" disclaimer only if the question is genuinely high-stakes (e.g. tax filing status, legal debt action) — don't append it to routine budgeting questions.`;

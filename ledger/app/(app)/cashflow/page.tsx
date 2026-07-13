import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getOrCreateHouseholdId } from "@/lib/household";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { buildCashFlowCalendar } from "@/lib/cashflow-calendar";
import { CashFlowGrid } from "@/components/cashflow/cash-flow-grid";
import type { Account, CashFlowEvent } from "@/types/database";

export default async function CashFlowPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const now = new Date();
  const [year, month] = monthParam
    ? monthParam.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];
  const monthIndex = month - 1;

  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const [{ data: eventsData }, { data: accountsData }] = await Promise.all([
    db.from("cash_flow_events").select("*").eq("household_id", householdId),
    db.from("accounts").select("*").eq("household_id", householdId),
  ]);

  const accounts = (accountsData ?? []) as Account[];
  const checkingBalance = accounts
    .filter((a) => !a.is_debt && a.subtype === "checking")
    .reduce((sum, a) => sum + Number(a.current_balance ?? 0), 0);

  const days = buildCashFlowCalendar(
    (eventsData ?? []) as CashFlowEvent[],
    year,
    monthIndex,
    checkingBalance,
  );

  const monthLabel = new Date(Date.UTC(year, monthIndex, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const prev = new Date(Date.UTC(year, monthIndex - 1, 1));
  const next = new Date(Date.UTC(year, monthIndex + 1, 1));
  const toParam = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-paper-50">Cash Flow Calendar</h1>
          <p className="mt-1 text-sm text-paper-500">
            Bills vs. paychecks, laid out by date. Starting from {checkingBalance > 0 ? "your checking balance" : "$0"}.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/cashflow?month=${toParam(prev)}`}
            className="rounded-DEFAULT p-2 text-paper-400 hover:bg-ink-800 hover:text-paper-50"
          >
            <ChevronLeft size={18} />
          </Link>
          <span className="w-36 text-center text-sm text-paper-300">{monthLabel}</span>
          <Link
            href={`/cashflow?month=${toParam(next)}`}
            className="rounded-DEFAULT p-2 text-paper-400 hover:bg-ink-800 hover:text-paper-50"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <CashFlowGrid days={days} />
      </div>
    </div>
  );
}

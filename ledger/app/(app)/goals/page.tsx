import { getOrCreateHouseholdId } from "@/lib/household";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { GoalCreateForm } from "@/components/goals/goal-create-form";
import { GoalCard } from "@/components/goals/goal-card";
import type { Goal } from "@/types/database";

export default async function GoalsPage() {
  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { data } = await db
    .from("goals")
    .select("*")
    .eq("household_id", householdId)
    .order("status", { ascending: true })
    .order("target_date", { ascending: true, nullsFirst: false });

  const goals = (data ?? []) as Goal[];
  const active = goals.filter((g) => g.status === "active");
  const done = goals.filter((g) => g.status !== "active");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <h1 className="text-xl font-medium text-paper-50">Goals</h1>
      <p className="mt-1 text-sm text-paper-500">
        Set it in plain English. Ledger tracks it and tells you if you&rsquo;re on pace.
      </p>

      <div className="mt-6">
        <GoalCreateForm />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {active.length === 0 && (
          <p className="text-sm text-paper-600">No active goals yet.</p>
        )}
        {active.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </div>

      {done.length > 0 && (
        <div className="mt-10">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper-600">
            Achieved / closed
          </p>
          <div className="flex flex-col gap-3 opacity-60">
            {done.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

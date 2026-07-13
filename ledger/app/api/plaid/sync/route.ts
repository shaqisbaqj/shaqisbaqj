import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { syncPlaidItem } from "@/lib/plaid/sync";

/**
 * Refreshes every linked account for the caller's household. Used both for
 * a manual "resync" affordance and as the target of a scheduled/cron
 * trigger — Plaid's transaction webhook (app/api/plaid/webhook, not yet
 * wired) would call this same path per item in production.
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createAdminSupabaseClient();

  const { data: membership } = await db
    .from("household_members")
    .select("household_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (!membership) return NextResponse.json({ error: "No household" }, { status: 404 });

  const { data: items } = await db
    .from("plaid_items")
    .select("id")
    .eq("household_id", membership.household_id)
    .eq("status", "active");

  const results = await Promise.all(
    (items ?? []).map((item) => syncPlaidItem(item.id)),
  );

  return NextResponse.json({ ok: true, synced: results.length, results });
}

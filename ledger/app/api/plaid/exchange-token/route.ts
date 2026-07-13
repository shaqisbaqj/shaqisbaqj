import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { plaidClient } from "@/lib/plaid/client";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOrCreateHouseholdId } from "@/lib/household";
import { syncPlaidItem } from "@/lib/plaid/sync";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { publicToken, institution } = (await request.json()) as {
    publicToken: string;
    institution?: { institution_id: string; name: string };
  };
  if (!publicToken) {
    return NextResponse.json({ error: "publicToken is required" }, { status: 400 });
  }

  const exchange = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { data: item, error } = await db
    .from("plaid_items")
    .insert({
      household_id: householdId,
      linked_by: userId,
      plaid_item_id: exchange.data.item_id,
      plaid_access_token: exchange.data.access_token,
      institution_id: institution?.institution_id ?? null,
      institution_name: institution?.name ?? null,
    })
    .select("id")
    .single();

  if (error || !item) {
    return NextResponse.json({ error: error?.message ?? "Failed to save item" }, { status: 500 });
  }

  const result = await syncPlaidItem(item.id);

  return NextResponse.json({ ok: true, ...result });
}

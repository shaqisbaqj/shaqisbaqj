import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOrCreateHouseholdId } from "@/lib/household";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as { current_amount?: number; status?: string };
  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const updates: Record<string, unknown> = {};
  if (typeof body.current_amount === "number") updates.current_amount = body.current_amount;
  if (typeof body.status === "string") updates.status = body.status;

  const { data: goal, error } = await db
    .from("goals")
    .update(updates)
    .eq("id", id)
    .eq("household_id", householdId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ goal });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { error } = await db.from("goals").delete().eq("id", id).eq("household_id", householdId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

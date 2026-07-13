import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOrCreateHouseholdId } from "@/lib/household";
import { parseGoalText } from "@/lib/goal-extraction";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = (await request.json()) as { text: string };
  if (!text?.trim()) return NextResponse.json({ error: "text is required" }, { status: 400 });

  let parsed;
  try {
    parsed = await parseGoalText(text);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Couldn't parse that goal" },
      { status: 422 },
    );
  }

  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { data: goal, error } = await db
    .from("goals")
    .insert({
      household_id: householdId,
      name: parsed.name,
      target_amount: parsed.target_amount,
      target_date: parsed.target_date,
      created_by: userId,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ goal });
}

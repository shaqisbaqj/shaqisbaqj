import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic/client";
import { ONBOARDING_SYSTEM_PROMPT, extractProfileBlock } from "@/lib/onboarding-prompt";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOrCreateHouseholdId } from "@/lib/household";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = (await request.json()) as { message: string };

  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { data: profile } = await db
    .from("financial_profiles")
    .select("answers, onboarding_complete")
    .eq("household_id", householdId)
    .single();

  const transcript: Turn[] = (profile?.answers as { transcript?: Turn[] })?.transcript ?? [];

  const isStart = message === "__start__";
  if (!isStart) {
    if (!message?.trim()) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    transcript.push({ role: "user", content: message });
  }

  const claudeMessages = isStart
    ? [{ role: "user" as const, content: "Let's start." }]
    : transcript;

  const response = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: 1024,
    system: ONBOARDING_SYSTEM_PROMPT,
    messages: claudeMessages,
  });

  const rawText = response.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const { displayText, profile: extracted } = extractProfileBlock(rawText);

  transcript.push({ role: "assistant", content: displayText });

  const updates: Record<string, unknown> = {
    answers: { transcript },
    updated_at: new Date().toISOString(),
  };

  if (extracted) {
    updates.onboarding_complete = true;
    if (typeof extracted.income_monthly === "number") updates.income_monthly = extracted.income_monthly;
    if (typeof extracted.pay_schedule === "string") updates.pay_schedule = extracted.pay_schedule;
    if (typeof extracted.risk_notes === "string") updates.risk_notes = extracted.risk_notes;
    if (typeof extracted.goals_summary === "string") updates.goals_summary = extracted.goals_summary;
    updates.answers = {
      transcript,
      debts_summary: extracted.debts_summary ?? null,
      bills_summary: extracted.bills_summary ?? null,
    };
  }

  await db.from("financial_profiles").update(updates).eq("household_id", householdId);

  return NextResponse.json({ reply: displayText, complete: Boolean(extracted) });
}

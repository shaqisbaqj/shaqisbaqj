import { auth } from "@clerk/nextjs/server";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic/client";
import { buildFinancialContext, LEDGER_SYSTEM_PROMPT } from "@/lib/financial-context";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getOrCreateHouseholdId } from "@/lib/household";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { message } = (await request.json()) as { message: string };
  if (!message?.trim()) return new Response("message is required", { status: 400 });

  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  await db.from("chat_messages").insert({
    household_id: householdId,
    user_id: userId,
    role: "user",
    content: message,
  });

  const [{ data: history }, context] = await Promise.all([
    db
      .from("chat_messages")
      .select("role, content")
      .eq("household_id", householdId)
      .order("created_at", { ascending: true })
      .limit(50),
    buildFinancialContext(householdId),
  ]);

  const claudeMessages = (history ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content as string,
  }));

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let full = "";
      try {
        const claudeStream = anthropic.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 1024,
          system: `${LEDGER_SYSTEM_PROMPT}\n\n---\nHousehold financial snapshot (live):\n${context}`,
          messages: claudeMessages,
        });

        claudeStream.on("text", (delta) => {
          full += delta;
          controller.enqueue(encoder.encode(delta));
        });

        await claudeStream.finalMessage();
      } catch (err) {
        controller.enqueue(encoder.encode("\n\nSomething went wrong reaching Claude. Try again in a moment."));
      } finally {
        controller.close();
        if (full.trim()) {
          await db.from("chat_messages").insert({
            household_id: householdId,
            user_id: null,
            role: "assistant",
            content: full,
          });
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

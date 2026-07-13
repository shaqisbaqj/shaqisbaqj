import "server-only";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic/client";

export interface ParsedGoal {
  name: string;
  target_amount: number;
  target_date: string | null; // YYYY-MM-DD
}

/**
 * Turns "Save $5k before July" into structured fields. This is the whole
 * point of plain-English goal entry — no amount/date form fields anywhere
 * in the UI.
 */
export async function parseGoalText(text: string): Promise<ParsedGoal> {
  const today = new Date().toISOString().slice(0, 10);

  const response = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: 300,
    system: `Extract a savings goal from plain English into strict JSON: {"name": string, "target_amount": number, "target_date": "YYYY-MM-DD" | null}. Today's date is ${today} — resolve relative dates ("by July", "in 6 months") against it, always choosing the next future occurrence. "name" should be a short human label (e.g. "Emergency Fund", "Riley's trip"), not a repeat of the whole sentence. Respond with ONLY the JSON object, nothing else.`,
    messages: [{ role: "user", content: text }],
  });

  const raw = response.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("");

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Couldn't parse a goal from that.");

  const parsed = JSON.parse(jsonMatch[0]);
  if (typeof parsed.name !== "string" || typeof parsed.target_amount !== "number") {
    throw new Error("Couldn't parse a goal from that.");
  }

  return {
    name: parsed.name,
    target_amount: parsed.target_amount,
    target_date: typeof parsed.target_date === "string" ? parsed.target_date : null,
  };
}

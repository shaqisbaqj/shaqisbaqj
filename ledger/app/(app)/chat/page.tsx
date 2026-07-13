import { getOrCreateHouseholdId } from "@/lib/household";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { ChatWindow } from "@/components/chat/chat-window";
import type { ChatMessage } from "@/types/database";

export default async function ChatPage() {
  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { data } = await db
    .from("chat_messages")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: true })
    .limit(50);

  return <ChatWindow initialMessages={(data ?? []) as ChatMessage[]} />;
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function JoinHouseholdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: householdId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-up?redirect_url=${encodeURIComponent(`/join/${householdId}`)}`);
  }

  const db = createAdminSupabaseClient();

  const { data: household } = await db.from("households").select("id, name").eq("id", householdId).maybeSingle();
  if (!household) {
    return (
      <Center>
        <h1 className="text-xl font-medium text-paper-50">Invite link not found</h1>
        <p className="mt-2 text-sm text-paper-500">This household invite doesn&apos;t exist or was removed.</p>
      </Center>
    );
  }

  const { data: existingMembership } = await db
    .from("household_members")
    .select("household_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingMembership) {
    if (existingMembership.household_id === householdId) {
      return (
        <Center>
          <h1 className="text-xl font-medium text-paper-50">You&rsquo;re already in this household</h1>
          <Link
            href="/chat"
            className="mt-4 inline-flex items-center justify-center rounded-DEFAULT bg-emerald-600 px-4 py-2 text-sm font-medium text-paper-50 hover:bg-emerald-500"
          >
            Go to chat
          </Link>
        </Center>
      );
    }
    return (
      <Center>
        <h1 className="text-xl font-medium text-paper-50">Already part of a household</h1>
        <p className="mt-2 max-w-sm text-sm text-paper-500">
          You&rsquo;re already sharing a different household with Ledger. Leave it first if you want to
          join this one instead.
        </p>
      </Center>
    );
  }

  await db.from("household_members").insert({ household_id: householdId, user_id: userId, role: "member" });
  redirect("/chat");
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2 bg-ink-950 px-6 text-center">
      {children}
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { getOrCreateHouseholdId } from "@/lib/household";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { Card, CardLabel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InviteCard } from "@/components/household/invite-card";
import { PlaidLinkButton } from "@/components/plaid/plaid-link-button";
import type { HouseholdMember } from "@/types/database";

export default async function HouseholdPage() {
  const { userId } = await auth();
  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { data: membersData } = await db
    .from("household_members")
    .select("*")
    .eq("household_id", householdId)
    .order("joined_at", { ascending: true });

  const members = (membersData ?? []) as HouseholdMember[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <h1 className="text-xl font-medium text-paper-50">Household</h1>
      <p className="mt-1 text-sm text-paper-500">
        Shared Household Mode: everyone here sees the same picture and can ask Ledger anything.
      </p>

      <div className="mt-6">
        <CardLabel className="mb-2">Members</CardLabel>
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <Card key={m.user_id} className="flex items-center justify-between">
              <div>
                <p className="text-paper-100">{m.display_name ?? (m.user_id === userId ? "You" : "Member")}</p>
                <p className="text-xs text-paper-600">Joined {new Date(m.joined_at).toLocaleDateString()}</p>
              </div>
              <Badge tone={m.role === "owner" ? "emerald" : "neutral"}>{m.role}</Badge>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <InviteCard householdId={householdId} />
      </div>

      <div className="mt-6">
        <Card className="flex items-center justify-between">
          <div>
            <CardLabel>Live account sync</CardLabel>
            <p className="mt-1 text-sm text-paper-400">
              Connect a bank via Plaid. Transactions pull automatically — nothing to enter by
              hand.
            </p>
          </div>
          <PlaidLinkButton />
        </Card>
      </div>
    </div>
  );
}

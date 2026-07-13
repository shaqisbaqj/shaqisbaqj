import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

/**
 * Resolves the signed-in user's household, creating one (as owner) on
 * first use — this is what turns "sign up" into "have a household" without
 * a separate setup step. Households with a second member are how Shared
 * Household Mode happens: nothing more than a second row in
 * household_members pointing at the same household_id.
 */
export async function getOrCreateHouseholdId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const db = createAdminSupabaseClient();

  const { data: membership } = await db
    .from("household_members")
    .select("household_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (membership) return membership.household_id;

  const { data: household, error: householdError } = await db
    .from("households")
    .insert({ name: "Household" })
    .select("id")
    .single();
  if (householdError || !household) {
    throw new Error(householdError?.message ?? "Failed to create household");
  }

  const { error: memberError } = await db.from("household_members").insert({
    household_id: household.id,
    user_id: userId,
    role: "owner",
  });
  if (memberError) throw new Error(memberError.message);

  const { error: profileError } = await db.from("financial_profiles").insert({
    household_id: household.id,
  });
  if (profileError) throw new Error(profileError.message);

  return household.id;
}

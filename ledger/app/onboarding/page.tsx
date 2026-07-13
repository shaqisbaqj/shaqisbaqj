import { getOrCreateHouseholdId } from "@/lib/household";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { OnboardingChat } from "@/components/onboarding/onboarding-chat";

export default async function OnboardingPage() {
  const householdId = await getOrCreateHouseholdId();
  const db = createAdminSupabaseClient();

  const { data: profile } = await db
    .from("financial_profiles")
    .select("onboarding_complete")
    .eq("household_id", householdId)
    .single();

  return <OnboardingChat alreadyComplete={Boolean(profile?.onboarding_complete)} />;
}

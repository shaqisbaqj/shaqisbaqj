import { getOrCreateHouseholdId } from "@/lib/household";
import { getDashboardSummary } from "@/lib/dashboard-data";
import { AppShell } from "@/components/app-shell/app-shell";
import { LeftRail } from "@/components/app-shell/left-rail";
import { RightRail } from "@/components/app-shell/right-rail";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const householdId = await getOrCreateHouseholdId();
  const summary = await getDashboardSummary(householdId);

  return (
    <AppShell
      leftRail={<LeftRail summary={summary} />}
      rightRail={<RightRail goals={summary.goals} bills={summary.upcomingBills} />}
    >
      {children}
    </AppShell>
  );
}

import DashboardNav from '@/components/layout/DashboardNav'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <DashboardNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

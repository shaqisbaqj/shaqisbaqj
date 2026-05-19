import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <aside className="w-60 min-h-screen bg-[#1C1A18] text-[#F5F0E8] flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="font-display text-xl font-semibold tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            UrProfile Admin
          </Link>
        </div>
        <nav className="px-3 py-4 flex flex-col gap-1">
          {[
            { href: '/admin', label: 'Overview', icon: LayoutDashboard },
            { href: '/admin/clients', label: 'Clients', icon: Users },
            { href: '/admin/contracts', label: 'Contracts', icon: FileText },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] hover:bg-white/5 transition-all"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  User,
  QrCode,
  BarChart3,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/interview', label: 'Interview', icon: MessageSquare },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/qr', label: 'QR Code', icon: QrCode },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-60 min-h-screen bg-[#1C1A18] text-[#F5F0E8] flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="font-display text-xl font-semibold tracking-wide">
          UrProfile
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
              pathname === href
                ? 'bg-[#C4622D] text-white'
                : 'text-[#F5F0E8]/60 hover:text-[#F5F0E8] hover:bg-white/5'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] hover:bg-white/5 transition-all duration-150"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

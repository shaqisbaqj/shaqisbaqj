import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, MessageSquare, User, QrCode, BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Dashboard — UrProfile' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: userData }, { data: profile }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
  ])

  const { data: recentScans } = await supabase
    .from('scans')
    .select('*')
    .eq('profile_id', profile?.id ?? '')
    .order('scanned_at', { ascending: false })
    .limit(5)

  const firstName = (userData?.full_name ?? user.email ?? '').split(' ')[0]

  const quickActions = [
    { href: '/dashboard/interview', icon: MessageSquare, label: 'Start AI Interview', desc: 'Extract your story' },
    { href: '/dashboard/profile', icon: User, label: 'Edit Profile', desc: 'Update your details' },
    { href: '/dashboard/qr', icon: QrCode, label: 'Get QR Code', desc: 'Download and share' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'View Analytics', desc: 'Track your scans' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <h1
          className="font-display text-4xl font-light text-[#1C1A18] mb-1"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-[#1C1A18]/60">
          {profile?.is_published ? (
            <>Your profile is live at{' '}
              <Link
                href={`/${userData?.username}`}
                className="text-[#C4622D] hover:underline"
              >
                urprofile.co/{userData?.username}
              </Link>
            </>
          ) : (
            "Your profile isn't published yet — complete the steps below to go live."
          )}
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: 'Profile status',
            value: profile?.is_published ? 'Live' : 'Draft',
            badge: profile?.is_published ? 'success' : 'warning',
          },
          {
            label: 'Plan',
            value: userData?.subscription_tier ?? 'free',
            badge: userData?.subscription_tier === 'pro' ? 'ember' : 'default',
          },
          {
            label: 'Total scans',
            value: '—',
            badge: 'default',
          },
          {
            label: 'Film uploaded',
            value: profile?.film_url ? 'Yes' : 'No',
            badge: profile?.film_url ? 'success' : 'default',
          },
        ].map(({ label, value, badge }) => (
          <Card key={label}>
            <CardContent className="py-4">
              <p className="text-xs text-[#1C1A18]/50 uppercase tracking-wider mb-1">{label}</p>
              <Badge variant={badge as 'success' | 'warning' | 'ember' | 'default'} className="capitalize">
                {value}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <h2
        className="font-display text-2xl font-medium text-[#1C1A18] mb-4"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Quick actions
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {quickActions.map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}>
            <Card className="hover:border-[#C4622D]/40 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C4622D]/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#C4622D]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1C1A18] text-sm">{label}</p>
                  <p className="text-xs text-[#1C1A18]/50">{desc}</p>
                </div>
                <ArrowRight size={16} className="text-[#1C1A18]/30" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {recentScans && recentScans.length > 0 && (
        <>
          <h2
            className="font-display text-2xl font-medium text-[#1C1A18] mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Recent scans
          </h2>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E0D4C0]">
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">Time</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="border-b border-[#E0D4C0] last:border-0">
                      <td className="px-6 py-3 text-[#1C1A18]/70">
                        {new Date(scan.scanned_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-[#1C1A18]/70">
                        {[scan.city, scan.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-6 py-3 text-[#1C1A18]/70 capitalize">
                        {scan.device_type || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

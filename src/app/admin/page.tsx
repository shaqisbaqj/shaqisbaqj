import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin — UrProfile' }

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: proUsers },
    { count: publishedProfiles },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'pro'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('users').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  return (
    <div className="p-8 max-w-5xl">
      <h1
        className="font-display text-4xl font-light text-[#1C1A18] mb-8"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Platform Overview
      </h1>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total users', value: totalUsers ?? 0 },
          { label: 'Pro subscribers', value: proUsers ?? 0 },
          { label: 'Live profiles', value: publishedProfiles ?? 0 },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="py-4">
              <p className="text-xs text-[#1C1A18]/50 uppercase tracking-wider mb-1">{label}</p>
              <p
                className="text-3xl font-light text-[#1C1A18]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-[#E0D4C0]">
            <h2 className="font-medium text-[#1C1A18]">Recent users</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E0D4C0]">
                {['Name', 'Username', 'Plan', 'Joined'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers?.map((u) => (
                <tr key={u.id} className="border-b border-[#E0D4C0] last:border-0 hover:bg-[#F5F0E8]/50">
                  <td className="px-6 py-3">
                    <Link href={`/admin/clients/${u.id}`} className="text-[#C4622D] hover:underline">
                      {u.full_name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-[#1C1A18]/60">{u.username ?? '—'}</td>
                  <td className="px-6 py-3">
                    <Badge variant={u.subscription_tier === 'pro' ? 'ember' : 'default'} className="capitalize">
                      {u.subscription_tier}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-[#1C1A18]/50">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

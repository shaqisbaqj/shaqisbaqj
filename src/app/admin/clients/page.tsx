import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Clients — Admin — UrProfile' }

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const { data: usersRaw } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: profilesRaw } = await supabase
    .from('profiles')
    .select('user_id, is_published, film_url')

  const profilesByUser = (profilesRaw ?? []).reduce<Record<string, { is_published: boolean; film_url: string | null }>>(
    (acc, p) => { acc[p.user_id] = p; return acc },
    {}
  )

  const users = (usersRaw ?? []).map((u) => ({
    ...u,
    profile: profilesByUser[u.id] ?? null,
  }))

  return (
    <div className="p-8 max-w-5xl">
      <h1
        className="font-display text-4xl font-light text-[#1C1A18] mb-6"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        All Clients
      </h1>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E0D4C0]">
                {['Name', 'Email', 'Username', 'Plan', 'Status', 'Profile', 'Joined'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => {
                const profile = u.profile
                return (
                  <tr key={u.id} className="border-b border-[#E0D4C0] last:border-0 hover:bg-[#F5F0E8]/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/clients/${u.id}`} className="text-[#C4622D] hover:underline font-medium">
                        {u.full_name ?? '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#1C1A18]/60">{u.email}</td>
                    <td className="px-4 py-3 text-[#1C1A18]/60">{u.username ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.subscription_tier === 'pro' ? 'ember' : 'default'} className="capitalize">
                        {u.subscription_tier}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.subscription_status === 'active' ? 'success' : 'default'} className="capitalize">
                        {u.subscription_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={profile?.is_published ? 'success' : 'warning'}>
                        {profile?.is_published ? 'Live' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[#1C1A18]/50">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

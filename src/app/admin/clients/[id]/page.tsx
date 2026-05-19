import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: user }, { data: profile }, { data: scans }] = await Promise.all([
    supabase.from('users').select('*').eq('id', id).single(),
    supabase.from('profiles').select('*').eq('user_id', id).single(),
    supabase.from('scans').select('*').eq('profile_id', id).order('scanned_at', { ascending: false }).limit(20),
  ])

  if (!user) notFound()

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-display text-4xl font-light text-[#1C1A18]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {user.full_name ?? 'Unknown'}
          </h1>
          <p className="text-sm text-[#1C1A18]/50 mt-1">{user.email}</p>
        </div>
        {user.username && profile?.is_published && (
          <Link
            href={`/${user.username}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-[#C4622D] hover:underline"
          >
            View profile <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Plan', value: user.subscription_tier, badge: (user.subscription_tier === 'pro' ? 'ember' : 'default') as 'ember' | 'default' },
          { label: 'Status', value: user.subscription_status, badge: (user.subscription_status === 'active' ? 'success' : 'default') as 'success' | 'default' },
          { label: 'Profile', value: profile?.is_published ? 'Live' : 'Draft', badge: (profile?.is_published ? 'success' : 'warning') as 'success' | 'warning' },
          { label: 'Film', value: profile?.film_url ? 'Uploaded' : 'None', badge: (profile?.film_url ? 'success' : 'default') as 'success' | 'default' },
        ].map(({ label, value, badge }) => (
          <Card key={label}>
            <CardContent className="py-4">
              <p className="text-xs text-[#1C1A18]/50 uppercase tracking-wider mb-1">{label}</p>
              <Badge variant={badge} className="capitalize">{value ?? '—'}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {profile && (
        <Card>
          <CardHeader><h2 className="font-medium text-[#1C1A18]">Profile details</h2></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><span className="text-[#1C1A18]/50">Headline: </span>{profile.headline ?? '—'}</div>
            <div><span className="text-[#1C1A18]/50">Location: </span>{profile.location ?? '—'}</div>
            <div><span className="text-[#1C1A18]/50">Slug: </span>{profile.landing_page_slug ?? '—'}</div>
            <div><span className="text-[#1C1A18]/50">Film URL: </span>
              {profile.film_url ? (
                <a href={profile.film_url} target="_blank" rel="noopener noreferrer" className="text-[#C4622D] hover:underline truncate">
                  {profile.film_url}
                </a>
              ) : '—'}
            </div>
          </CardContent>
        </Card>
      )}

      {scans && scans.length > 0 && (
        <Card>
          <CardHeader><h2 className="font-medium text-[#1C1A18]">Recent scans ({scans.length})</h2></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0D4C0]">
                  {['Time', 'Location', 'Device', 'Referrer'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => (
                  <tr key={scan.id} className="border-b border-[#E0D4C0] last:border-0">
                    <td className="px-6 py-2.5 text-[#1C1A18]/60">{new Date(scan.scanned_at).toLocaleString()}</td>
                    <td className="px-6 py-2.5 text-[#1C1A18]/60">{[scan.city, scan.country].filter(Boolean).join(', ') || '—'}</td>
                    <td className="px-6 py-2.5 text-[#1C1A18]/60 capitalize">{scan.device_type ?? '—'}</td>
                    <td className="px-6 py-2.5 text-[#1C1A18]/60 truncate max-w-xs">{scan.referrer ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

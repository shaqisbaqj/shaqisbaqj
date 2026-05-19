import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Sparkles, TrendingUp, MapPin, Smartphone, Monitor } from 'lucide-react'
import AnalyticsInsight from './AnalyticsInsight'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Analytics — UrProfile' }

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="p-8">
        <h1 className="font-display text-4xl font-light text-[#1C1A18]"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}>Analytics</h1>
        <p className="text-[#1C1A18]/60 mt-2">Set up your profile to start tracking scans.</p>
      </div>
    )
  }

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const [
    { data: allScans },
    { data: thisWeekScans },
    { data: lastWeekScans },
  ] = await Promise.all([
    supabase.from('scans').select('*').eq('profile_id', profile.id),
    supabase.from('scans').select('*').eq('profile_id', profile.id).gte('scanned_at', weekAgo.toISOString()),
    supabase.from('scans').select('*').eq('profile_id', profile.id)
      .gte('scanned_at', twoWeeksAgo.toISOString())
      .lt('scanned_at', weekAgo.toISOString()),
  ])

  const totalScans = allScans?.length ?? 0
  const thisWeekCount = thisWeekScans?.length ?? 0
  const lastWeekCount = lastWeekScans?.length ?? 0
  const weekChange = lastWeekCount > 0
    ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100)
    : thisWeekCount > 0 ? 100 : 0

  const deviceBreakdown = (allScans ?? []).reduce((acc, s) => {
    const d = s.device_type ?? 'unknown'
    acc[d] = (acc[d] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const locationBreakdown = (allScans ?? [])
    .filter((s) => s.country)
    .reduce((acc, s) => {
      const key = [s.city, s.country].filter(Boolean).join(', ')
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)

  const topLocations = Object.entries(locationBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const scanData = {
    totalScans,
    thisWeekCount,
    lastWeekCount,
    deviceBreakdown,
    topLocations: topLocations.slice(0, 3),
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1
        className="font-display text-4xl font-light text-[#1C1A18] mb-8"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Analytics
      </h1>

      {/* Weekly insight */}
      <AnalyticsInsight scanData={scanData} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total scans', value: totalScans, icon: TrendingUp },
          {
            label: 'This week',
            value: thisWeekCount,
            sub: weekChange !== 0 ? `${weekChange > 0 ? '+' : ''}${weekChange}% vs last week` : 'No change',
            icon: TrendingUp,
          },
          {
            label: 'Mobile',
            value: `${totalScans > 0 ? Math.round(((deviceBreakdown.mobile ?? 0) / totalScans) * 100) : 0}%`,
            icon: Smartphone,
          },
          {
            label: 'Desktop',
            value: `${totalScans > 0 ? Math.round(((deviceBreakdown.desktop ?? 0) / totalScans) * 100) : 0}%`,
            icon: Monitor,
          },
        ].map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-[#C4622D]" />
                <p className="text-xs text-[#1C1A18]/50 uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-2xl font-light text-[#1C1A18]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {value}
              </p>
              {sub && <p className="text-xs text-[#1C1A18]/40 mt-1">{sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top locations */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-[#C4622D]" />
              <h2 className="font-medium text-[#1C1A18]">Top locations</h2>
            </div>
            {topLocations.length > 0 ? (
              <ul className="space-y-3">
                {topLocations.map(([location, count]) => (
                  <li key={location} className="flex items-center justify-between">
                    <span className="text-sm text-[#1C1A18]/70">{location}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[#E0D4C0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C4622D] rounded-full"
                          style={{ width: `${(count / totalScans) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#1C1A18]/50 w-6 text-right">{count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#1C1A18]/40">No scan data yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Device breakdown */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={16} className="text-[#C4622D]" />
              <h2 className="font-medium text-[#1C1A18]">Device breakdown</h2>
            </div>
            {totalScans > 0 ? (
              <ul className="space-y-3">
                {Object.entries(deviceBreakdown).map(([device, count]) => (
                  <li key={device} className="flex items-center justify-between">
                    <span className="text-sm text-[#1C1A18]/70 capitalize">{device}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[#E0D4C0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C4622D] rounded-full"
                          style={{ width: `${(count / totalScans) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#1C1A18]/50 w-6 text-right">{count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#1C1A18]/40">No scan data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

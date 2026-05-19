'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

export default function AnalyticsInsight({ scanData }: { scanData: object }) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scanData }),
    })
      .then((r) => r.json())
      .then((d) => {
        setInsight(d.insight ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-[#1C1A18] text-[#F5F0E8] rounded-xl p-5 mb-8 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-3/4" />
      </div>
    )
  }

  if (!insight) return null

  return (
    <div className="bg-[#1C1A18] text-[#F5F0E8] rounded-xl p-5 mb-8 flex items-start gap-3">
      <Sparkles size={16} className="text-[#C4622D] shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-1">Weekly insight</p>
        <p className="text-sm text-[#F5F0E8]/80 leading-relaxed">{insight}</p>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function BillingActions({
  isPro,
  hasCustomerId,
  showUpgrade,
}: {
  isPro: boolean
  hasCustomerId: boolean
  showUpgrade?: boolean
}) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(false)
  }

  const handleManage = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(false)
  }

  if (showUpgrade || !isPro) {
    return (
      <Button size="md" loading={loading} onClick={handleUpgrade}>
        Start free trial
      </Button>
    )
  }

  if (isPro && hasCustomerId) {
    return (
      <Button variant="secondary" size="md" loading={loading} onClick={handleManage}>
        Manage subscription
      </Button>
    )
  }

  return null
}

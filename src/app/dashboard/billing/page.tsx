import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Check } from 'lucide-react'
import BillingActions from './BillingActions'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Billing — UrProfile' }

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, subscription_status, stripe_customer_id')
    .eq('id', user.id)
    .single()

  const params = await searchParams
  const isSuccess = params?.success === 'true'
  const isPro = userData?.subscription_tier === 'pro' || userData?.subscription_tier === 'enterprise'

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <h1
        className="font-display text-4xl font-light text-[#1C1A18]"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Billing
      </h1>

      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
          You&apos;re now on Pro — welcome to the full experience!
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-[#1C1A18]">Current plan</h2>
            <Badge variant={isPro ? 'ember' : 'default'} className="capitalize">
              {userData?.subscription_tier ?? 'free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#1C1A18]/60 mb-4">
            {isPro
              ? `Subscription status: ${userData?.subscription_status ?? 'active'}`
              : 'You are on the Free plan. Upgrade to Pro to unlock all features.'}
          </p>
          <BillingActions
            isPro={isPro}
            hasCustomerId={!!userData?.stripe_customer_id}
          />
        </CardContent>
      </Card>

      {!isPro && (
        <Card className="border-[#C4622D]/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-[#1C1A18]">Pro — $29/month</h2>
              <Badge variant="ember">14-day free trial</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {[
                'Remove UrProfile branding',
                'Full analytics dashboard',
                'Weekly AI insights',
                'Custom QR colors',
                'Priority AI optimization',
                'Unlimited interview sessions',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-[#1C1A18]/70">
                  <Check size={13} className="text-[#C4622D] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <BillingActions isPro={false} hasCustomerId={false} showUpgrade />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

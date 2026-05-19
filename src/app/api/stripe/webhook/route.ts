import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const getCustomerId = (obj: Stripe.Subscription | Stripe.Invoice): string | null => {
    const c = obj.customer
    return typeof c === 'string' ? c : (c as Stripe.Customer)?.id ?? null
  }

  const updateUserByCustomer = async (customerId: string, updates: Record<string, unknown>) => {
    await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('stripe_customer_id', customerId)
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = getCustomerId(sub)
      if (customerId) {
        await updateUserByCustomer(customerId, {
          subscription_tier: sub.status === 'active' || sub.status === 'trialing' ? 'pro' : 'free',
          subscription_status: sub.status,
        })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = getCustomerId(sub)
      if (customerId) {
        await updateUserByCustomer(customerId, {
          subscription_tier: 'free',
          subscription_status: 'canceled',
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

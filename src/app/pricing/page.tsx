import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'

export const metadata = {
  title: 'Pricing — UrProfile',
}

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Get started with your visual profile.',
    features: [
      '1 profile page',
      'UrProfile branded footer',
      'Basic QR code',
      'AI interview (1 session)',
      'Core analytics',
    ],
    cta: 'Get started free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '29',
    period: 'per month',
    description: 'For professionals who want the full experience.',
    features: [
      'Everything in Free',
      'Remove UrProfile branding',
      'Full analytics dashboard',
      'Weekly AI insights',
      'Custom QR colors',
      'Priority AI optimization',
      'Unlimited interview sessions',
      '14-day free trial',
    ],
    cta: 'Start free trial',
    href: '/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For institutions and cohort programs.',
    features: [
      'Everything in Pro',
      'Cohort management',
      'Bulk profile creation',
      'Dedicated account manager',
      'Custom contract terms',
      'White-label options',
      'API access',
    ],
    cta: 'Contact sales',
    href: 'mailto:sales@urprofile.co',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16 bg-[#F5F0E8]">
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-4">Pricing</p>
              <h1
                className="font-display text-5xl md:text-6xl font-light text-[#1C1A18] mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Simple, transparent pricing
              </h1>
              <p className="text-[#1C1A18]/60 max-w-xl mx-auto">
                Start free. Upgrade when you&apos;re ready. No hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 flex flex-col ${
                    plan.highlight
                      ? 'bg-[#1C1A18] text-[#F5F0E8] shadow-2xl scale-105'
                      : 'bg-[#FDFAF4] border border-[#E0D4C0]'
                  }`}
                >
                  {plan.highlight && (
                    <span className="inline-block mb-4 text-xs font-medium uppercase tracking-widest text-[#C4622D]">
                      Most popular
                    </span>
                  )}
                  <h2
                    className={`font-display text-3xl font-semibold mb-1 ${plan.highlight ? 'text-[#F5F0E8]' : 'text-[#1C1A18]'}`}
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {plan.name}
                  </h2>
                  <div className="flex items-end gap-1 mb-2">
                    {plan.price !== 'Custom' && (
                      <span className={`text-4xl font-light ${plan.highlight ? 'text-[#F5F0E8]' : 'text-[#1C1A18]'}`}>
                        ${plan.price}
                      </span>
                    )}
                    {plan.price === 'Custom' && (
                      <span className={`text-4xl font-light ${plan.highlight ? 'text-[#F5F0E8]' : 'text-[#1C1A18]'}`}>
                        Custom
                      </span>
                    )}
                    <span className={`text-sm pb-1 ${plan.highlight ? 'text-[#F5F0E8]/50' : 'text-[#1C1A18]/50'}`}>
                      /{plan.period}
                    </span>
                  </div>
                  <p className={`text-sm mb-8 ${plan.highlight ? 'text-[#F5F0E8]/60' : 'text-[#1C1A18]/60'}`}>
                    {plan.description}
                  </p>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check size={14} className="mt-0.5 shrink-0 text-[#C4622D]" />
                        <span className={plan.highlight ? 'text-[#F5F0E8]/80' : 'text-[#1C1A18]/70'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.href}>
                    <Button
                      size="md"
                      className={`w-full ${
                        plan.highlight
                          ? 'bg-[#C4622D] text-white hover:bg-[#a8521f]'
                          : ''
                      }`}
                      variant={plan.highlight ? 'primary' : 'secondary'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-[#E0D4C0]">
          <div className="max-w-3xl mx-auto px-6">
            <h2
              className="font-display text-3xl font-medium text-[#1C1A18] text-center mb-12"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'What happens after my free trial ends?',
                  a: 'Your profile stays live but reverts to the Free tier features. You can upgrade again at any time.',
                },
                {
                  q: 'Can I cancel my Pro subscription?',
                  a: 'Yes, cancel anytime from your billing dashboard. Your Pro features remain active until the end of your billing period.',
                },
                {
                  q: 'How does the AI interview work?',
                  a: 'It\'s a conversational experience — not a form. Claude asks adaptive questions across three phases to extract your unique story, then generates a Story Brief and Script Framework.',
                },
                {
                  q: 'What video formats are supported?',
                  a: 'Upload MP4, MOV, or AVI. Videos are processed by Mux for optimal streaming quality on any device.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-[#FDFAF4] rounded-xl p-6 border border-[#E0D4C0]">
                  <h3 className="font-medium text-[#1C1A18] mb-2">{q}</h3>
                  <p className="text-sm text-[#1C1A18]/60 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

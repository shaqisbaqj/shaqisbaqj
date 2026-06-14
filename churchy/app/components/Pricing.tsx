'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const tiers = [
  {
    name: 'Starter',
    price: '$149',
    period: '/month',
    desc: 'Perfect for smaller congregations getting started with automation.',
    limit: 'Up to 100 guests/month',
    features: [
      'Planning Center integration',
      'Automated email follow-ups',
      'Guest engagement dashboard',
      'Follow-up templates',
      'Email support',
    ],
    cta: 'Get Early Access',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$249',
    period: '/month',
    desc: 'For growing churches ready to scale their guest care.',
    limit: 'Up to 300 guests/month',
    features: [
      'Everything in Starter',
      'SMS follow-ups',
      'Custom follow-up sequences',
      'Team assignment & routing',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Get Early Access',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Ministry',
    price: '$399',
    period: '/month',
    desc: 'For large or multi-campus churches with unlimited needs.',
    limit: 'Unlimited guests',
    features: [
      'Everything in Growth',
      'Multi-campus support',
      'Custom integrations',
      'White-label options',
      'Dedicated account manager',
      'Onboarding & training',
    ],
    cta: 'Get Early Access',
    highlight: false,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="pricing" className="py-24 px-6 bg-[#0D1117]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">
            Transparent pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Simple plans, no surprises
          </h2>
          <p className="mt-4 text-white/45 max-w-md mx-auto text-sm">
            All plans include a 30-day free trial. No credit card required to start.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.55 }}
              className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
                tier.highlight
                  ? 'bg-[#C9A84C] text-[#0D1117] shadow-2xl shadow-[#C9A84C]/20 scale-[1.02]'
                  : 'bg-white/5 border border-white/10 text-white'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0D1117] text-[#C9A84C] text-xs font-bold">
                  {tier.badge}
                </div>
              )}

              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${tier.highlight ? 'text-[#0D1117]/60' : 'text-white/40'}`}>
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className={`text-sm font-medium ${tier.highlight ? 'text-[#0D1117]/60' : 'text-white/40'}`}>
                    {tier.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${tier.highlight ? 'text-[#0D1117]/70' : 'text-white/45'}`}>
                  {tier.desc}
                </p>
              </div>

              <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-block ${tier.highlight ? 'bg-[#0D1117]/12' : 'bg-white/8'}`}>
                {tier.limit}
              </div>

              <ul className="flex flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? 'text-[#0D1117]' : 'text-[#C9A84C]'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className={tier.highlight ? 'text-[#0D1117]/80' : 'text-white/65'}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`mt-auto w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                  tier.highlight
                    ? 'bg-[#0D1117] text-white hover:bg-[#1a2332]'
                    : 'bg-[#C9A84C] text-[#0D1117] hover:bg-[#d4b560]'
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

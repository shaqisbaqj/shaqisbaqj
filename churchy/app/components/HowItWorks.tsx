'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Connect your Planning Center account',
    desc: 'Link Churchy to Planning Center in under two minutes. We sync your guest data automatically — no CSV exports, no manual work.',
  },
  {
    number: '02',
    title: 'Set your follow-up rules',
    desc: 'Tell Churchy when to reach out, what to say, and who handles the personal touch. Your tone, your timeline, your church.',
  },
  {
    number: '03',
    title: 'Churchy handles the rest',
    desc: 'Every new guest gets a timely, personal follow-up. You get a dashboard showing who\'s engaging and who needs a call.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">
            Simple setup
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1117] leading-tight">
            How it works
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-8 top-12 bottom-12 w-px bg-[#0D1117]/10 hidden sm:block" />

          <div className="flex flex-col gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.55 }}
                className="flex gap-6 items-start"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#0D1117] text-[#C9A84C] font-bold text-sm flex items-center justify-center z-10 relative shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-lg font-semibold text-[#0D1117] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#0D1117]/60 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function EarlyAccess() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('');
  const [church, setChurch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !church) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section ref={ref} id="waitlist" className="py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">
            Limited spots available
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1117] leading-tight mb-4">
            Be one of the first churches to automate guest follow-up
          </h2>
          <p className="text-[#0D1117]/55 mb-10 leading-relaxed">
            We&apos;re onboarding a small group of churches to shape the product. Join the waitlist
            and we&apos;ll reach out personally to get you set up.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {submitted ? (
            <div className="rounded-2xl bg-[#0D1117] text-white p-10 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mb-2">
                <svg className="w-7 h-7 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">You&apos;re on the list!</h3>
              <p className="text-white/55 text-sm">
                We&apos;ll be in touch soon with next steps. Thank you for trusting us with your church&apos;s guest care.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Your church name"
                  value={church}
                  onChange={(e) => setChurch(e.target.value)}
                  required
                  className="flex-1 px-4 py-3.5 rounded-xl border border-[#0D1117]/15 text-[#0D1117] placeholder-[#0D1117]/35 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all bg-[#F7F6F4]"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3.5 rounded-xl border border-[#0D1117]/15 text-[#0D1117] placeholder-[#0D1117]/35 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all bg-[#F7F6F4]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#C9A84C] text-[#0D1117] font-semibold text-base hover:bg-[#d4b560] transition-all duration-200 disabled:opacity-60 shadow-lg shadow-[#C9A84C]/25 hover:shadow-[#C9A84C]/40 hover:-translate-y-0.5"
              >
                {loading ? 'Joining...' : 'Join the Waitlist'}
              </button>
              <p className="text-xs text-[#0D1117]/35">
                No spam, ever. We&apos;ll only reach out about Churchy.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

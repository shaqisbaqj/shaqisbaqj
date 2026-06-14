'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const churches = [
  { name: 'Riverside Community Church', location: 'Austin, TX', size: '450 members' },
  { name: 'Grace Fellowship', location: 'Nashville, TN', size: '1,200 members' },
  { name: 'New Life Church', location: 'Denver, CO', size: '680 members' },
  { name: 'Harbor Church', location: 'San Diego, CA', size: '320 members' },
  { name: 'The Table', location: 'Portland, OR', size: '550 members' },
  { name: 'Journey Church', location: 'Atlanta, GA', size: '900 members' },
];

export default function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 px-6 bg-[#F7F6F4]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">
            Early adopters
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1117] leading-tight">
            Trusted by churches across the country
          </h2>
          <p className="mt-4 text-[#0D1117]/50 max-w-md mx-auto text-sm">
            Join the growing list of churches automating their guest follow-up with Churchy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {churches.map((church, i) => (
            <motion.div
              key={church.name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.08, duration: 0.5 }}
              className="bg-white rounded-xl border border-[#0D1117]/8 p-5 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#0D1117] flex items-center justify-center text-white text-xs font-bold">
                  {church.name.charAt(0)}
                </div>
                <span className="text-xs text-[#0D1117]/40 font-medium">{church.size}</span>
              </div>
              <p className="text-sm font-semibold text-[#0D1117]">{church.name}</p>
              <p className="text-xs text-[#0D1117]/45">{church.location}</p>
              <div className="mt-2 pt-3 border-t border-[#0D1117]/6">
                <p className="text-xs text-[#0D1117]/35 italic">Testimonial coming soon...</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

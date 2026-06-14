'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const problems = [
  {
    icon: '👋',
    title: 'Guests visit once and disappear',
    desc: 'A first-time visitor shows up, has a great experience — then never comes back. Not because they didn\'t want to, but because no one reached out.',
  },
  {
    icon: '📋',
    title: 'Nobody owns follow-up',
    desc: 'It\'s everyone\'s job, so it\'s no one\'s job. Without a system, guests slip through the gaps between staff and volunteers.',
  },
  {
    icon: '😓',
    title: 'Your team is already stretched thin',
    desc: 'Your staff is doing the work of three people. Manual follow-up emails feel like one more thing on an already impossible list.',
  },
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">
            Sound familiar?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D1117] leading-tight">
            The Problem Every Church Faces
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.55 }}
              className="rounded-2xl border border-[#0D1117]/8 bg-[#F7F6F4] p-7 flex flex-col gap-4"
            >
              <div className="text-3xl">{p.icon}</div>
              <h3 className="text-lg font-semibold text-[#0D1117]">{p.title}</h3>
              <p className="text-sm text-[#0D1117]/60 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

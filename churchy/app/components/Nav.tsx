'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D1117]/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            Churchy
          </span>
          <span className="text-[#C9A84C] text-xl font-bold">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#about" className="text-sm text-white/70 hover:text-white transition-colors">
            About
          </a>
          <a
            href="#waitlist"
            className="px-4 py-2 rounded-lg bg-[#C9A84C] text-[#0D1117] text-sm font-semibold hover:bg-[#d4b560] transition-colors"
          >
            Get Early Access
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0D1117]/98 border-t border-white/10 px-6 py-4 flex flex-col gap-4"
        >
          <a href="#features" className="text-white/70 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#pricing" className="text-white/70 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#about" className="text-white/70 hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>About</a>
          <a
            href="#waitlist"
            className="px-4 py-2 rounded-lg bg-[#C9A84C] text-[#0D1117] text-sm font-semibold text-center hover:bg-[#d4b560] transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Get Early Access
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}

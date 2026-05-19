'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0E8]/90 backdrop-blur-sm border-b border-[#E0D4C0]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold text-[#1C1A18] tracking-wide">
          UrProfile
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-sm text-[#1C1A18]/70 hover:text-[#1C1A18] transition-colors">
            About
          </Link>
          <Link href="/pricing" className="text-sm text-[#1C1A18]/70 hover:text-[#1C1A18] transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-sm text-[#1C1A18]/70 hover:text-[#1C1A18] transition-colors">
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        <button
          className="md:hidden text-[#1C1A18]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#F5F0E8] border-t border-[#E0D4C0] px-6 py-4 flex flex-col gap-4">
          <Link href="/about" className="text-sm text-[#1C1A18]/70" onClick={() => setOpen(false)}>About</Link>
          <Link href="/pricing" className="text-sm text-[#1C1A18]/70" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/login" className="text-sm text-[#1C1A18]/70" onClick={() => setOpen(false)}>Sign in</Link>
          <Link href="/signup">
            <Button size="sm" className="w-full" onClick={() => setOpen(false)}>Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  )
}

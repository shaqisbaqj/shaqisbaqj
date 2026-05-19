'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex">
      <div className="hidden lg:flex flex-1 bg-[#1C1A18] items-center justify-center p-16">
        <div className="max-w-md">
          <Link href="/" className="font-display text-3xl font-semibold text-[#F5F0E8] tracking-wide block mb-12"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            UrProfile
          </Link>
          <blockquote className="font-display text-3xl font-light text-[#F5F0E8]/80 leading-snug italic mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            &ldquo;The most important story you&apos;ll ever tell is your own.&rdquo;
          </blockquote>
          <p className="text-sm text-[#C9B99A]">— UrProfile</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <Link href="/" className="font-display text-2xl font-semibold text-[#1C1A18] tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              UrProfile
            </Link>
          </div>

          <h1 className="font-display text-3xl font-medium text-[#1C1A18] mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Welcome back
          </h1>
          <p className="text-sm text-[#1C1A18]/60 mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            <Button type="submit" loading={loading} className="w-full" size="md">
              Sign in
            </Button>
          </form>

          <p className="text-sm text-[#1C1A18]/60 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#C4622D] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

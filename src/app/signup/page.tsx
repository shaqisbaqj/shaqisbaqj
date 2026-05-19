'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/onboarding')
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
          <h2 className="font-display text-4xl font-light text-[#F5F0E8] leading-snug mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Your profile film is<br />
            <span className="text-[#C4622D]">30 minutes away.</span>
          </h2>
          <ul className="space-y-4 text-sm text-[#F5F0E8]/60">
            {[
              'Complete an AI story interview',
              'Get your Script Framework & Story Brief',
              'Upload your film or self-shoot guided',
              'Share via QR code and track every scan',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4622D] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
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
            Create your account
          </h1>
          <p className="text-sm text-[#1C1A18]/60 mb-8">Start your free profile today</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Rivera"
              required
            />
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
              minLength={8}
              required
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            <Button type="submit" loading={loading} className="w-full" size="md">
              Create account
            </Button>
          </form>

          <p className="text-xs text-[#1C1A18]/40 text-center mt-4 leading-relaxed">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-sm text-[#1C1A18]/60 text-center mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#C4622D] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

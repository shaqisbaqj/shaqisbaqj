'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Step = 'welcome' | 'username' | 'role' | 'done'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<'individual' | 'institution'>('individual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
      } else {
        setUserId(user.id)
      }
    })
  }, [router])

  const handleComplete = async () => {
    if (!userId) return
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()
    const { error: userError } = await supabase.from('users').upsert({
      id: userId,
      email: authUser?.email ?? '',
      username: username.toLowerCase().trim(),
      role,
      subscription_tier: 'free',
      subscription_status: 'active',
    })

    if (userError) {
      setError(userError.message)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: userId,
      landing_page_slug: username.toLowerCase().trim(),
      is_published: false,
    })

    if (profileError && !profileError.message.includes('duplicate')) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    setStep('done')
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {step === 'welcome' && (
          <div className="text-center">
            <h1
              className="font-display text-5xl font-light text-[#1C1A18] mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Welcome to UrProfile
            </h1>
            <p className="text-[#1C1A18]/60 mb-10 leading-relaxed">
              Let&apos;s set up your account in just two quick steps.
            </p>
            <Button size="lg" onClick={() => setStep('username')}>
              Let&apos;s get started
            </Button>
          </div>
        )}

        {step === 'username' && (
          <div>
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-2">Step 1 of 2</p>
              <h2
                className="font-display text-4xl font-light text-[#1C1A18] mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Choose your username
              </h2>
              <p className="text-sm text-[#1C1A18]/60">
                Your profile will live at urprofile.co/<strong>{username || 'yourname'}</strong>
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center bg-[#FDFAF4] border border-[#E0D4C0] rounded-md overflow-hidden">
                <span className="px-4 py-2.5 text-sm text-[#1C1A18]/40 border-r border-[#E0D4C0] whitespace-nowrap">
                  urprofile.co/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="yourname"
                  className="flex-1 px-4 py-2.5 bg-transparent text-[#1C1A18] placeholder-[#C9B99A] focus:outline-none"
                />
              </div>
              <p className="text-xs text-[#1C1A18]/40">Lowercase letters, numbers and hyphens only.</p>
              <Button
                size="md"
                className="w-full"
                onClick={() => setStep('role')}
                disabled={username.length < 2}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'role' && (
          <div>
            <div className="mb-8">
              <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-2">Step 2 of 2</p>
              <h2
                className="font-display text-4xl font-light text-[#1C1A18] mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Who are you?
              </h2>
              <p className="text-sm text-[#1C1A18]/60">This helps us tailor your experience.</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { value: 'individual', label: 'Individual', desc: 'Professional, freelancer, creator, or job seeker' },
                { value: 'institution', label: 'Institution', desc: 'University, company, or organization' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setRole(value as 'individual' | 'institution')}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    role === value
                      ? 'border-[#C4622D] bg-[#C4622D]/5'
                      : 'border-[#E0D4C0] bg-[#FDFAF4] hover:border-[#C9B99A]'
                  }`}
                >
                  <p className="font-medium text-[#1C1A18]">{label}</p>
                  <p className="text-sm text-[#1C1A18]/60 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
            <Button size="md" className="w-full" loading={loading} onClick={handleComplete}>
              Complete setup
            </Button>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-light text-[#1C1A18]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              You&apos;re all set!
            </h2>
            <p className="text-sm text-[#1C1A18]/60 mt-2">Taking you to your dashboard…</p>
          </div>
        )}
      </div>
    </div>
  )
}

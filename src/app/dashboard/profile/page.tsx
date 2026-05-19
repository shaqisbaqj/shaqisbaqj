'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { ExternalLink, Upload } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [filmUrl, setFilmUrl] = useState('')
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [slug, setSlug] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (data) {
        setProfileId(data.id)
        setHeadline(data.headline ?? '')
        setBio(data.bio ?? '')
        setLocation(data.location ?? '')
        setFilmUrl(data.film_url ?? '')
        setCtaLabel(data.cta_label ?? '')
        setCtaUrl(data.cta_url ?? '')
        setIsPublished(data.is_published)
        setSlug(data.landing_page_slug ?? '')
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('profiles').upsert({
      id: profileId ?? undefined,
      user_id: user.id,
      headline,
      bio,
      location,
      film_url: filmUrl || null,
      cta_label: ctaLabel || null,
      cta_url: ctaUrl || null,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="animate-pulse text-[#C9B99A]">Loading…</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-display text-4xl font-light text-[#1C1A18]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your Profile
          </h1>
          {slug && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#C4622D] hover:underline mt-1"
            >
              urprofile.co/{slug}
              <ExternalLink size={12} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <div
              onClick={() => setIsPublished(!isPublished)}
              className={`w-10 h-6 rounded-full transition-colors ${
                isPublished ? 'bg-[#C4622D]' : 'bg-[#E0D4C0]'
              } relative cursor-pointer`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  isPublished ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="text-[#1C1A18]/70">{isPublished ? 'Published' : 'Draft'}</span>
          </label>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-medium text-[#1C1A18]">Basic info</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Product Designer · Building better futures"
          />
          <Textarea
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A brief description that appears on your profile page…"
            rows={4}
          />
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Francisco, CA"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-medium text-[#1C1A18]">Film</h2>
          <p className="text-sm text-[#1C1A18]/50 mt-0.5">Enter a Mux playback URL or upload your film.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Mux Playback URL"
            value={filmUrl}
            onChange={(e) => setFilmUrl(e.target.value)}
            placeholder="https://stream.mux.com/..."
          />
          <div className="border-2 border-dashed border-[#E0D4C0] rounded-lg p-8 text-center">
            <Upload size={24} className="mx-auto text-[#C9B99A] mb-3" />
            <p className="text-sm text-[#1C1A18]/50 mb-2">Upload your film (MP4, MOV)</p>
            <p className="text-xs text-[#1C1A18]/30">Up to 2GB · Processed by Mux</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-medium text-[#1C1A18]">Call to action</h2>
          <p className="text-sm text-[#1C1A18]/50 mt-0.5">The button that appears on your profile page.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Button label"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="Connect with me"
          />
          <Input
            label="Button URL"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="https://linkedin.com/in/yourname"
          />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved successfully!</p>}

      <Button size="md" loading={saving} onClick={handleSave}>
        Save changes
      </Button>
    </div>
  )
}

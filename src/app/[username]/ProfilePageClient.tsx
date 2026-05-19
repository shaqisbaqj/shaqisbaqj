'use client'

import { MapPin, ExternalLink } from 'lucide-react'
import type { UserRow, ProfileRow } from '@/types/database'

interface Props {
  user: Pick<UserRow, 'full_name' | 'username' | 'subscription_tier'>
  profile: ProfileRow
}

export default function ProfilePageClient({ user, profile }: Props) {
  const isPro = user.subscription_tier === 'pro' || user.subscription_tier === 'enterprise'
  const hasFilm = !!profile.film_url

  return (
    <div className="min-h-screen bg-[#1C1A18] text-[#F5F0E8]">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex flex-col items-center justify-end pb-12 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1A18] via-[#1C1A18]/80 to-[#1C1A18]" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Avatar placeholder */}
          <div className="w-20 h-20 rounded-full bg-[#C4622D]/20 border-2 border-[#C4622D]/40 flex items-center justify-center mx-auto mb-6">
            <span
              className="text-3xl font-light text-[#C4622D]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              {(user.full_name ?? user.username ?? '?')[0].toUpperCase()}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-light mb-3 tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {user.full_name ?? user.username}
          </h1>

          {profile.headline && (
            <p className="text-[#F5F0E8]/60 text-lg mb-3">{profile.headline}</p>
          )}

          {profile.location && (
            <div className="flex items-center justify-center gap-1.5 text-sm text-[#F5F0E8]/40">
              <MapPin size={13} />
              {profile.location}
            </div>
          )}
        </div>
      </div>

      {/* Video */}
      {hasFilm && (
        <div className="max-w-2xl mx-auto px-6 mb-10">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            {profile.film_url?.includes('mux.com') ? (
              <iframe
                src={profile.film_url.replace('stream.mux.com', 'player.mux.com').replace('.m3u8', '')}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                src={profile.film_url ?? undefined}
                className="w-full h-full object-cover"
                controls
                playsInline
                autoPlay
                muted
              />
            )}
          </div>
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <div className="max-w-xl mx-auto px-6 mb-10 text-center">
          <p
            className="text-lg text-[#F5F0E8]/70 leading-relaxed font-light italic"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            &ldquo;{profile.bio}&rdquo;
          </p>
        </div>
      )}

      {/* CTA */}
      {(profile.cta_url || profile.cta_label) && (
        <div className="max-w-xl mx-auto px-6 mb-10 text-center">
          <a
            href={profile.cta_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white px-8 py-3.5 rounded-lg text-sm font-medium hover:bg-[#a8521f] transition-colors"
          >
            {profile.cta_label ?? `Connect with ${user.full_name?.split(' ')[0] ?? 'me'}`}
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Links */}
      {profile.links && Array.isArray(profile.links) && profile.links.length > 0 && (
        <div className="max-w-xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {(profile.links as { label: string; url: string }[]).map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-sm text-[#F5F0E8]/60 hover:text-[#F5F0E8] hover:border-white/20 transition-colors"
              >
                {link.label}
                <ExternalLink size={11} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer branding (free tier only) */}
      {!isPro && (
        <div className="py-6 text-center border-t border-white/5">
          <a
            href="/"
            className="text-xs text-[#F5F0E8]/20 hover:text-[#F5F0E8]/40 transition-colors"
          >
            Powered by UrProfile
          </a>
        </div>
      )}
    </div>
  )
}

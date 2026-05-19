import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProfilePageClient from './ProfilePageClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, full_name, username, subscription_tier')
    .eq('username', username)
    .single()

  if (!user) return { title: 'Profile not found — UrProfile' }

  const displayName = (user as { full_name?: string | null }).full_name ?? username

  return {
    title: `${displayName} — UrProfile`,
    description: `View ${displayName}'s visual profile on UrProfile.`,
    openGraph: {
      title: `${displayName} — UrProfile`,
      description: `View ${displayName}'s visual profile.`,
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, full_name, username, subscription_tier')
    .eq('username', username)
    .single()

  if (!user) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_published', true)
    .single()

  if (!profile) notFound()

  return (
    <ProfilePageClient
      user={user}
      profile={profile}
    />
  )
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type { QRCodeRow } from '@/types/database'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const supabase = await createClient()

  const { data: qrCode } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('short_code', code)
    .single()

  if (!qrCode) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const typedQR = qrCode as QRCodeRow

  const { data: profile } = await supabase
    .from('profiles')
    .select('landing_page_slug')
    .eq('id', typedQR.profile_id)
    .single()

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? null
  const ua = headersList.get('user-agent') ?? ''
  const referer = headersList.get('referer') ?? null

  const deviceType = /mobile|android|iphone|ipad/i.test(ua) ? 'mobile' : 'desktop'

  await supabase.from('scans').insert({
    qr_code_id: typedQR.id,
    profile_id: typedQR.profile_id,
    ip_address: ip,
    device_type: deviceType,
    referrer: referer,
  })

  const slug = (profile as { landing_page_slug: string | null } | null)?.landing_page_slug

  const destination = slug
    ? `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`
    : process.env.NEXT_PUBLIC_APP_URL!

  return NextResponse.redirect(destination, { status: 302 })
}

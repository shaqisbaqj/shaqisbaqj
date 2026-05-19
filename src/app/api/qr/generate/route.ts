import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'
import { NextResponse } from 'next/server'
import { generateShortCode } from '@/lib/utils'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { profileId, fgColor = '#C4622D', bgColor = '#FDFAF4', format = 'png' } = await req.json()

  const shortCode = generateShortCode()
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${shortCode}`

  const { error } = await supabase.from('qr_codes').insert({
    profile_id: profileId,
    user_id: user.id,
    redirect_url: redirectUrl,
    short_code: shortCode,
    design_config: { fgColor, bgColor },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const qrOptions = {
    color: { dark: fgColor, light: bgColor },
    width: 512,
    margin: 2,
  }

  if (format === 'svg') {
    const svg = await QRCode.toString(redirectUrl, { type: 'svg', ...qrOptions })
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  }

  const buffer = await QRCode.toBuffer(redirectUrl, { type: 'png', ...qrOptions })
  return new Response(buffer as unknown as BodyInit, {
    headers: { 'Content-Type': 'image/png' },
  })
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const shortCode = url.searchParams.get('code')
  const fgColor = url.searchParams.get('fg') ?? '#C4622D'
  const bgColor = url.searchParams.get('bg') ?? '#FDFAF4'
  const format = url.searchParams.get('format') ?? 'png'

  if (!shortCode) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/qr/${shortCode}`

  const qrOptions = {
    color: { dark: fgColor, light: bgColor },
    width: 512,
    margin: 2,
  }

  if (format === 'svg') {
    const svg = await QRCode.toString(redirectUrl, { type: 'svg', ...qrOptions })
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="qr-${shortCode}.svg"`,
      },
    })
  }

  const buffer = await QRCode.toBuffer(redirectUrl, { type: 'png', ...qrOptions })
  return new Response(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="qr-${shortCode}.png"`,
    },
  })
}

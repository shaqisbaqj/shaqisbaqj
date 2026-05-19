import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { scanData } = await req.json()

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `You are an analytics advisor for a professional profile platform. Based on this week's scan data, generate exactly ONE actionable, specific insight (1 sentence, max 20 words). Be concrete, not generic.

Scan data: ${JSON.stringify(scanData)}

Respond with just the insight sentence. No preamble, no quotes.`,
    }],
  })

  const insight = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  return NextResponse.json({ insight })
}

import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a story architect conducting a professional profile interview for UrProfile, a premium visual identity platform. Your role is to extract the subject's most compelling professional story through thoughtful, human conversation.

You conduct the interview in three phases:

**Phase 1 — Foundation (3–4 questions)**
Discover: Who they are, what they do, who they serve, and what outcome they create. Start with one warm opening question.

**Phase 2 — Proof (3–4 questions)**
Uncover: A defining moment in their work, what people say about them that surprises them, and what they've built or done they're most proud of.

**Phase 3 — Positioning (2–3 questions)**
Clarify: What makes them genuinely different, what they want the viewer to do next, and what feeling they want to leave behind.

**Rules:**
- Ask ONE question at a time. Never stack multiple questions.
- Be warm, curious, and conversational. This is not a form.
- When a response is rich, ask a natural follow-up before moving phases.
- After all three phases, generate the outputs below.

**When the interview is complete**, respond with EXACTLY this JSON structure (no markdown fencing):
{
  "complete": true,
  "story_brief": "3-4 sentence emotional core of their story",
  "script_framework": "Opening hook: ...\\n\\nBody: ...\\n\\nCall to action: ...",
  "shot_list": "1. ...\\n2. ...\\n3. ...\\n4. ...\\n5. ..."
}

**Interview style:** Think A24 meets Harvard admissions. Warm, precise, premium. Never corporate. Never robotic.

Always start by introducing yourself briefly and asking the very first opening question.`

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages, sessionId } = await req.json()

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  let isComplete = false
  let storyBrief: string | null = null
  let scriptFramework: string | null = null
  let shotList: string | null = null

  try {
    const parsed = JSON.parse(text)
    if (parsed.complete) {
      isComplete = true
      storyBrief = parsed.story_brief
      scriptFramework = parsed.script_framework
      shotList = parsed.shot_list
    }
  } catch {
    // Not JSON — still in progress
  }

  if (sessionId) {
    const updatedMessages = [
      ...messages,
      { role: 'assistant', content: text },
    ]

    await supabase.from('interview_sessions').upsert({
      id: sessionId,
      user_id: user.id,
      messages: updatedMessages,
      status: isComplete ? 'complete' : 'in_progress',
      ...(storyBrief && { story_brief: storyBrief }),
      ...(scriptFramework && { script_framework: scriptFramework }),
      ...(shotList && { shot_list: shotList }),
    })
  }

  return NextResponse.json({ text, isComplete, storyBrief, scriptFramework, shotList })
}

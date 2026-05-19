'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function detectPhase(messages: Message[]): number {
  const count = messages.filter((m) => m.role === 'assistant').length
  if (count < 4) return 1
  if (count < 8) return 2
  return 3
}

export default function InterviewPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [isComplete, setIsComplete] = useState(false)
  const [outputs, setOutputs] = useState<{
    storyBrief: string | null
    scriptFramework: string | null
    shotList: string | null
  }>({ storyBrief: null, scriptFramework: null, shotList: null })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = crypto.randomUUID()
    setSessionId(id)
    startInterview(id)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = async (id: string) => {
    setLoading(true)
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [], sessionId: id }),
    })
    const data = await res.json()
    setMessages([{ role: 'assistant', content: data.text }])
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage: Message = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updatedMessages, sessionId }),
    })
    const data = await res.json()

    if (data.isComplete) {
      setIsComplete(true)
      setOutputs({
        storyBrief: data.storyBrief,
        scriptFramework: data.scriptFramework,
        shotList: data.shotList,
      })
    } else {
      setMessages([...updatedMessages, { role: 'assistant', content: data.text }])
    }
    setLoading(false)
  }

  const phase = detectPhase(messages)

  if (isComplete && outputs.storyBrief) {
    return (
      <div className="p-8 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Interview complete
          </div>
          <h1
            className="font-display text-4xl font-light text-[#1C1A18]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your Story Brief
          </h1>
        </div>

        <div className="space-y-6">
          <div className="bg-[#FDFAF4] border border-[#E0D4C0] rounded-xl p-6">
            <h2
              className="font-display text-xl font-medium text-[#1C1A18] mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Story Brief
            </h2>
            <p className="text-[#1C1A18]/70 leading-relaxed italic">&ldquo;{outputs.storyBrief}&rdquo;</p>
          </div>

          <div className="bg-[#FDFAF4] border border-[#E0D4C0] rounded-xl p-6">
            <h2
              className="font-display text-xl font-medium text-[#1C1A18] mb-3"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Script Framework
            </h2>
            <pre className="text-sm text-[#1C1A18]/70 leading-relaxed whitespace-pre-wrap font-sans">
              {outputs.scriptFramework}
            </pre>
          </div>

          {outputs.shotList && (
            <div className="bg-[#FDFAF4] border border-[#E0D4C0] rounded-xl p-6">
              <h2
                className="font-display text-xl font-medium text-[#1C1A18] mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Shot List
              </h2>
              <pre className="text-sm text-[#1C1A18]/70 leading-relaxed whitespace-pre-wrap font-sans">
                {outputs.shotList}
              </pre>
            </div>
          )}

          <div className="flex gap-3">
            <a href="/dashboard/profile">
              <Button size="md">Set up your profile →</Button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-8 py-5 border-b border-[#E0D4C0] bg-[#FDFAF4] flex items-center justify-between">
        <div>
          <h1
            className="font-display text-2xl font-medium text-[#1C1A18]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            AI Story Interview
          </h1>
          <p className="text-xs text-[#1C1A18]/50">Phase {phase} of 3</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((p) => (
            <div
              key={p}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                p <= phase ? 'bg-[#C4622D] w-8' : 'bg-[#E0D4C0] w-4'
              )}
            />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'max-w-2xl',
              msg.role === 'user' ? 'ml-auto' : 'mr-auto'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-[#C4622D] flex items-center justify-center mb-2">
                <span className="text-white text-xs font-medium">U</span>
              </div>
            )}
            <div
              className={cn(
                'px-5 py-3.5 rounded-2xl text-sm leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-[#FDFAF4] border border-[#E0D4C0] text-[#1C1A18] rounded-tl-sm'
                  : 'bg-[#1C1A18] text-[#F5F0E8] rounded-tr-sm ml-auto'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="max-w-2xl">
            <div className="w-7 h-7 rounded-full bg-[#C4622D] flex items-center justify-center mb-2">
              <span className="text-white text-xs font-medium">U</span>
            </div>
            <div className="bg-[#FDFAF4] border border-[#E0D4C0] px-5 py-3.5 rounded-2xl rounded-tl-sm inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9B99A] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9B99A] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9B99A] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-8 py-5 border-t border-[#E0D4C0] bg-[#FDFAF4]">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Type your response…"
            rows={2}
            className="flex-1 resize-none px-4 py-3 bg-white border border-[#E0D4C0] rounded-xl text-sm text-[#1C1A18] placeholder-[#C9B99A] focus:outline-none focus:ring-2 focus:ring-[#C4622D] focus:border-transparent"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="shrink-0 w-10 h-10 p-0 rounded-xl flex items-center justify-center"
          >
            <Send size={15} />
          </Button>
        </div>
        <p className="text-xs text-center text-[#1C1A18]/30 mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

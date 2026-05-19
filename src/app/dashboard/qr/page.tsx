'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Download, QrCode as QrCodeIcon } from 'lucide-react'
import type { QRCodeRow } from '@/types/database'

export default function QRPage() {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [qrCodes, setQrCodes] = useState<QRCodeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [fgColor, setFgColor] = useState('#C4622D')
  const [bgColor, setBgColor] = useState('#FDFAF4')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (profile) {
        setProfileId(profile.id)
        const { data: codes } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('profile_id', profile.id)
          .order('created_at', { ascending: false })
        setQrCodes(codes ?? [])

        if (codes && codes.length > 0) {
          setPreviewUrl(
            `/api/qr/generate?code=${codes[0].short_code}&fg=${encodeURIComponent(fgColor)}&bg=${encodeURIComponent(bgColor)}`
          )
        }
      }
      setLoading(false)
    })
  }, [])

  const handleGenerate = async () => {
    if (!profileId) return
    setGenerating(true)
    const res = await fetch('/api/qr/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, fgColor, bgColor }),
    })
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: codes } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false })
        setQrCodes(codes ?? [])
      }
    }
    setGenerating(false)
  }

  const handleDownload = async (shortCode: string, format: 'png' | 'svg') => {
    const url = `/api/qr/generate?code=${shortCode}&fg=${encodeURIComponent(fgColor)}&bg=${encodeURIComponent(bgColor)}&format=${format}`
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-urprofile.${format}`
    a.click()
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
      <h1
        className="font-display text-4xl font-light text-[#1C1A18]"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        QR Code
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-medium text-[#1C1A18]">Customize</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1C1A18] block mb-1.5">
                Foreground color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-[#E0D4C0]"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1C1A18] block mb-1.5">
                Background color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-[#E0D4C0]"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <Button
              size="md"
              className="w-full"
              loading={generating}
              onClick={handleGenerate}
            >
              <QrCodeIcon size={15} className="mr-2" />
              Generate new QR code
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-medium text-[#1C1A18]">Preview</h2>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="QR code preview"
                  className="w-48 h-48 rounded-lg"
                />
                {qrCodes.length > 0 && (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(qrCodes[0].short_code, 'png')}
                    >
                      <Download size={13} className="mr-1.5" />
                      PNG
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownload(qrCodes[0].short_code, 'svg')}
                    >
                      <Download size={13} className="mr-1.5" />
                      SVG
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-[#C9B99A]">
                <QrCodeIcon size={40} className="mb-3" />
                <p className="text-sm">Generate your first QR code</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {qrCodes.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-medium text-[#1C1A18]">All QR codes</h2>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0D4C0]">
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">Short code</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#1C1A18]/50 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {qrCodes.map((code) => (
                  <tr key={code.id} className="border-b border-[#E0D4C0] last:border-0">
                    <td className="px-6 py-3 font-mono text-[#1C1A18]/70">{code.short_code}</td>
                    <td className="px-6 py-3 text-[#1C1A18]/50">
                      {new Date(code.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(code.short_code, 'png')}>
                          PNG
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(code.short_code, 'svg')}>
                          SVG
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

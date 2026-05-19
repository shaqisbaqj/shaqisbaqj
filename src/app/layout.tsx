import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UrProfile — Be Seen. Be Known. Be Chosen.',
  description: 'AI-powered visual profile platform. Get a professionally produced 2–3 minute profile film delivered on a branded mobile landing page.',
  openGraph: {
    title: 'UrProfile',
    description: 'Be Seen. Be Known. Be Chosen.',
    siteName: 'UrProfile',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

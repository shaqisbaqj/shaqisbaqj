import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="min-h-screen flex items-center bg-[#1C1A18] text-[#F5F0E8] pt-16">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-6">
              Your story, finally seen
            </p>
            <h1
              className="font-display text-5xl md:text-7xl font-light leading-[1.05] mb-8"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Be Seen.<br />
              Be Known.<br />
              <span className="text-[#C4622D]">Be Chosen.</span>
            </h1>
            <p className="text-lg text-[#F5F0E8]/60 leading-relaxed mb-10 max-w-md">
              UrProfile replaces your resume and pitch deck with a produced visual story —
              a 2–3 minute film on a premium mobile landing page, delivered via QR code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg">Create your profile</Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="secondary" className="border-white/20 text-[#F5F0E8] hover:bg-white/10">
                  See pricing
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative w-72 h-[500px] mx-auto">
              {/* Phone mockup */}
              <div className="absolute inset-0 bg-[#F5F0E8] rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-[#C9B99A]/30">
                <div className="h-full bg-gradient-to-b from-[#1C1A18] to-[#2a2723] flex flex-col items-center justify-center p-8 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#C4622D]/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#C4622D]" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-xl text-[#F5F0E8] font-semibold">Alex Rivera</p>
                    <p className="text-xs text-[#C9B99A] mt-1">Product Designer</p>
                  </div>
                  <div className="w-full aspect-video bg-[#C4622D]/10 rounded-lg flex items-center justify-center border border-[#C4622D]/20">
                    <div className="w-10 h-10 rounded-full bg-[#C4622D]/80 flex items-center justify-center">
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
                        <path d="M1 1l12 7-12 7V1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <p className="text-xs text-[#F5F0E8]/40 text-center">Scan count: 142</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-4">The process</p>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-[#1C1A18]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              From interview to iconic
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'AI Story Interview',
                desc: 'Our AI conducts a thoughtful conversation to extract your most compelling story — no scripts, no forms.',
              },
              {
                step: '02',
                title: 'Film Production',
                desc: 'Receive a produced 2–3 minute profile film, or self-shoot guided by your AI-generated script.',
              },
              {
                step: '03',
                title: 'Live Profile & QR',
                desc: 'Your branded landing page goes live. Share your QR code. Track every scan in your dashboard.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <span className="font-display text-7xl font-light text-[#E0D4C0] absolute -top-4 -left-2 select-none">
                  {step}
                </span>
                <div className="relative pt-10 pl-2">
                  <h3 className="font-display text-2xl font-medium text-[#1C1A18] mb-3"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {title}
                  </h3>
                  <p className="text-sm text-[#1C1A18]/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#1C1A18]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-4">Everything you need</p>
            <h2
              className="font-display text-4xl md:text-5xl font-light text-[#F5F0E8]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Built for the modern professional
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Interview Engine', desc: 'Adaptive conversation that extracts your story in three focused phases.' },
              { title: 'Premium Video Player', desc: 'Full-bleed, mobile-optimized film player with autoplay and analytics.' },
              { title: 'Smart QR Codes', desc: 'Branded codes with real-time scan tracking and geographic data.' },
              { title: 'Analytics Dashboard', desc: 'Know who viewed your profile, when, where, and for how long.' },
              { title: 'Weekly AI Insights', desc: 'Personalized recommendations to maximize your profile\'s reach.' },
              { title: 'Instant Sharing', desc: 'Share via QR, link, or embed — optimized for LinkedIn, email, and print.' },
            ].map(({ title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-white/10 hover:border-[#C4622D]/40 transition-colors">
                <h3 className="font-display text-xl font-medium text-[#F5F0E8] mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {title}
                </h3>
                <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#C4622D]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2
            className="font-display text-4xl md:text-5xl font-light text-[#FDFAF4] mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Your story deserves to be seen
          </h2>
          <p className="text-[#FDFAF4]/80 mb-10 leading-relaxed">
            Join professionals and organizations using UrProfile to make lasting first impressions.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-[#1C1A18] text-[#F5F0E8] hover:bg-[#2a2723] border-0"
            >
              Start free today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}

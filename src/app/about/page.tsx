import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata = {
  title: 'About — UrProfile',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="min-h-[60vh] flex items-center bg-[#1C1A18] text-[#F5F0E8]">
          <div className="max-w-4xl mx-auto px-6 py-24 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-[#C4622D] mb-6">Our mission</p>
            <h1
              className="font-display text-5xl md:text-7xl font-light leading-tight mb-8"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              The resume is dead.<br />
              <span className="text-[#C4622D]">Long live your story.</span>
            </h1>
            <p className="text-lg text-[#F5F0E8]/60 leading-relaxed max-w-2xl mx-auto">
              UrProfile was built on a simple conviction: the most important thing about you cannot fit in a PDF.
              Your story is alive, emotional, and uniquely yours — and the world deserves to experience it that way.
            </p>
          </div>
        </section>

        <section className="py-24 bg-[#F5F0E8]">
          <div className="max-w-3xl mx-auto px-6 space-y-16">
            <div>
              <h2
                className="font-display text-3xl font-medium text-[#1C1A18] mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Why we built this
              </h2>
              <p className="text-[#1C1A18]/70 leading-relaxed mb-4">
                We watched brilliant people lose opportunities because their credentials couldn&apos;t communicate
                their character. We watched organizations spend millions on recruiting only to discover their candidates
                were a cultural mismatch. And we watched the rise of short-form video change every other industry —
                except professional identity.
              </p>
              <p className="text-[#1C1A18]/70 leading-relaxed">
                UrProfile is the platform where professional identity finally catches up. Where your 2-minute film
                does what your 2-page resume never could.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { stat: '30 min', label: 'Average time from signup to live profile' },
                { stat: '94%', label: 'Of viewers watch the full 2-minute film' },
                { stat: '3×', label: 'More callbacks vs. traditional resume' },
              ].map(({ stat, label }) => (
                <div key={stat} className="p-6 bg-[#FDFAF4] rounded-xl border border-[#E0D4C0]">
                  <p
                    className="font-display text-4xl font-semibold text-[#C4622D] mb-2"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {stat}
                  </p>
                  <p className="text-sm text-[#1C1A18]/60">{label}</p>
                </div>
              ))}
            </div>

            <div>
              <h2
                className="font-display text-3xl font-medium text-[#1C1A18] mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Built for humans, powered by AI
              </h2>
              <p className="text-[#1C1A18]/70 leading-relaxed mb-4">
                Our AI interview engine isn&apos;t a form with text boxes. It&apos;s a thoughtful conversation designed
                by story architects to surface the moments that define you — the proof, the positioning, the emotional
                core that makes people remember you.
              </p>
              <p className="text-[#1C1A18]/70 leading-relaxed">
                The AI doesn&apos;t write your story. It helps you find it.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#C4622D] text-center">
          <div className="max-w-xl mx-auto px-6">
            <h2
              className="font-display text-4xl font-light text-[#FDFAF4] mb-6"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Ready to be seen?
            </h2>
            <Link href="/signup">
              <Button size="lg" className="bg-[#1C1A18] text-[#F5F0E8] hover:bg-[#2a2723] border-0">
                Create your profile
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

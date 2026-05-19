import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1C1A18] text-[#F5F0E8] py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl font-semibold mb-3">UrProfile</h3>
            <p className="text-sm text-[#F5F0E8]/50 leading-relaxed">
              Be Seen. Be Known. Be Chosen.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-[#C9B99A] mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[#F5F0E8]/60">
              <li><Link href="/pricing" className="hover:text-[#F5F0E8] transition-colors">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-[#F5F0E8] transition-colors">About</Link></li>
              <li><Link href="/signup" className="hover:text-[#F5F0E8] transition-colors">Get started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-[#C9B99A] mb-4">Account</h4>
            <ul className="space-y-3 text-sm text-[#F5F0E8]/60">
              <li><Link href="/login" className="hover:text-[#F5F0E8] transition-colors">Sign in</Link></li>
              <li><Link href="/signup" className="hover:text-[#F5F0E8] transition-colors">Sign up</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#F5F0E8] transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest text-[#C9B99A] mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-[#F5F0E8]/60">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#F5F0E8]/30">© {new Date().getFullYear()} UrProfile. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

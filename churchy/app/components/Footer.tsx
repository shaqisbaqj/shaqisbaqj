export default function Footer() {
  return (
    <footer className="bg-[#0D1117] border-t border-white/8 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xl font-bold text-white tracking-tight">Churchy</span>
              <span className="text-[#C9A84C] text-xl font-bold">.</span>
            </div>
            <p className="text-sm text-white/35">
              Guest follow-up, finally automated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">Product</p>
              <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>
              <a href="#how-it-works" className="text-sm text-white/50 hover:text-white transition-colors">How it works</a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">Company</p>
              <a href="#about" className="text-sm text-white/50 hover:text-white transition-colors">About</a>
              <a href="#waitlist" className="text-sm text-white/50 hover:text-white transition-colors">Early Access</a>
              <a href="mailto:hello@churchy.app" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} Churchy LLC &middot; churchy.app
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

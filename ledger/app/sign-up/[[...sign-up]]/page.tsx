import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">
            Ledger
          </span>
          <h1 className="mt-3 text-2xl font-medium text-paper-50">
            Get your financial foundation locked in
          </h1>
        </div>
        <SignUp />
      </div>
    </div>
  );
}

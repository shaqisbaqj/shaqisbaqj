"use client";

import { useState, type ReactNode } from "react";
import { Wallet, Target, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { AppNav } from "@/components/app-shell/app-nav";

export function AppShell({
  leftRail,
  rightRail,
  children,
}: {
  leftRail: ReactNode;
  rightRail: ReactNode;
  children: ReactNode;
}) {
  const [mobilePanel, setMobilePanel] = useState<"left" | "right" | null>(null);

  return (
    <div className="flex h-dvh flex-col bg-ink-950 lg:flex-row">
      {/* Desktop left rail */}
      <aside className="hidden w-[280px] shrink-0 border-r border-ink-800 lg:block">
        {leftRail}
      </aside>

      {/* Center: chat / active page. Full width on mobile, flexes between rails on desktop. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-800 px-3 py-2 lg:px-4">
          <button
            className="rounded-DEFAULT p-2 text-paper-400 hover:bg-ink-800 hover:text-paper-50 lg:hidden"
            onClick={() => setMobilePanel("left")}
            aria-label="Account health"
          >
            <Wallet size={20} />
          </button>

          <AppNav className="hidden lg:flex" />
          <span className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400 lg:hidden">
            Ledger
          </span>

          <div className="flex items-center gap-1">
            <button
              className="rounded-DEFAULT p-2 text-paper-400 hover:bg-ink-800 hover:text-paper-50 lg:hidden"
              onClick={() => setMobilePanel("right")}
              aria-label="Goals and bills"
            >
              <Target size={20} />
            </button>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        <AppNav className="flex border-b border-ink-800 px-2 py-1.5 lg:hidden" />

        <main className="min-h-0 flex-1">{children}</main>
      </div>

      {/* Desktop right rail */}
      <aside className="hidden w-[320px] shrink-0 border-l border-ink-800 lg:block">
        {rightRail}
      </aside>

      {/* Mobile slide-over panels — everything tucked behind a single tap. */}
      {mobilePanel && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobilePanel(null)}
          />
          <div
            className={
              "absolute top-0 h-full w-[86%] max-w-sm bg-ink-950 shadow-2xl " +
              (mobilePanel === "left" ? "left-0 border-r" : "right-0 border-l") +
              " border-ink-800"
            }
          >
            <div className="flex justify-end p-2">
              <button
                className="rounded-DEFAULT p-2 text-paper-400 hover:bg-ink-800 hover:text-paper-50"
                onClick={() => setMobilePanel(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {mobilePanel === "left" ? leftRail : rightRail}
          </div>
        </div>
      )}
    </div>
  );
}

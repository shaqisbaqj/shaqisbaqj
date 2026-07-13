"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/chat", label: "Chat" },
  { href: "/goals", label: "Goals" },
  { href: "/debt", label: "Debt" },
  { href: "/cashflow", label: "Cash Flow" },
  { href: "/household", label: "Household" },
];

export function AppNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("gap-1", className)}>
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-DEFAULT px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-emerald-900/50 text-emerald-300"
                : "text-paper-400 hover:bg-ink-800 hover:text-paper-100",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

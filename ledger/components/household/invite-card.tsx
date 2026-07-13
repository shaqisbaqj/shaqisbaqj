"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InviteCard({ householdId }: { householdId: string }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? `${window.location.origin}/join/${householdId}` : "";

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardLabel>Invite someone</CardLabel>
      <p className="mt-1 text-sm text-paper-400">
        Share this link. Whoever opens it — Riley, a partner, anyone — sees the same picture you
        do. One financial brain for the household.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 truncate rounded-DEFAULT border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-paper-300"
        />
        <Button variant="secondary" onClick={copy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </Card>
  );
}

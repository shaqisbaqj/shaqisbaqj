"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink, type PlaidLinkOnSuccessMetadata } from "react-plaid-link";
import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";

export function PlaidLinkButton({ onLinked }: { onLinked?: () => void }) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/plaid/create-link-token", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setLinkToken(data.linkToken))
      .catch(() => setLinkToken(null));
  }, []);

  const onSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      setBusy(true);
      try {
        await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicToken,
            institution: metadata.institution,
          }),
        });
        onLinked?.();
      } finally {
        setBusy(false);
      }
    },
    [onLinked],
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
  });

  return (
    <Button
      variant="secondary"
      onClick={() => open()}
      disabled={!ready || !linkToken || busy}
    >
      <Landmark size={16} />
      {busy ? "Linking…" : "Connect a bank account"}
    </Button>
  );
}

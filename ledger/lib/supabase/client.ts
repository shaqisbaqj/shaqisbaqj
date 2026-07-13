"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client-component Supabase client, authenticated as the signed-in Clerk
 * user via Supabase's third-party auth integration (Clerk is registered as
 * an auth provider in the Supabase dashboard, so RLS policies can read
 * auth.jwt()->>'sub' directly — no separate Supabase session needed).
 */
export function useSupabaseClient() {
  const { session } = useSession();

  return useMemo(
    () =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        accessToken: async () => (await session?.getToken()) ?? null,
      }),
    [session],
  );
}

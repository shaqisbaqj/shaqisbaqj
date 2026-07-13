import "server-only";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Server Component / Route Handler Supabase client, scoped to the calling
 * Clerk user's session (RLS-enforced — same trust boundary as the browser
 * client, just usable inside `async` server code).
 */
export async function createServerSupabaseClient() {
  const { getToken } = await auth();

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    accessToken: async () => (await getToken()) ?? null,
  });
}

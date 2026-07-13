import "server-only";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Service-role Supabase client. Bypasses RLS entirely — only use this from
 * trusted server code (Plaid webhooks/sync, chat context assembly) that has
 * already established the caller's household membership itself. Never
 * import this into anything that runs in, or is bundled for, the browser.
 */
export function createAdminSupabaseClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

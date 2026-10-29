import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Service-role client. Bypasses RLS — server-side use only.
 * Never import from client components.
 */
export function createAdminSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY)");
  }

  cached = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cached;
}

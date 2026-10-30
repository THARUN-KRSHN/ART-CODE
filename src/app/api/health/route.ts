import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(url),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(anonKey),
    SUPABASE_SECRET_KEY: Boolean(secret),
    ADMIN_EMAILS: Boolean(process.env.ADMIN_EMAILS),
    NEXT_PUBLIC_SITE_URL: Boolean(siteUrl),
  } as const;

  let authSettings: any = null;
  try {
    if (url && anonKey) {
      const res = await fetch(`${url}/auth/v1/settings`, {
        headers: { apikey: anonKey },
        cache: "no-store",
      });
      if (res.ok) authSettings = await res.json();
    }
  } catch {}

  let db: { ok: boolean; error?: string } = { ok: false };
  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin.from("event_settings").select("id").eq("id", 1).maybeSingle();
    if (error) db = { ok: false, error: error.message };
    else db = { ok: Boolean(data) };
  } catch (e: any) {
    db = { ok: false, error: e?.message || "admin client failed" };
  }

  return NextResponse.json({
    env,
    db,
    auth: {
      google_enabled: Boolean(authSettings?.external?.google),
      email_enabled: authSettings?.external?.email ?? true,
      signup_disabled: Boolean(authSettings?.disable_signup),
      info: authSettings ? undefined : "Could not read /auth/v1/settings",
    },
  });
}

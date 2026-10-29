import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Reports which sign-in methods are enabled for this Supabase project so the
 * UI never hardcodes provider availability.
 */
export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: anonKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ email: true, google: false }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({
      email: Boolean(data.external?.email),
      google: Boolean(data.external?.google),
      signupDisabled: Boolean(data.disable_signup),
      emailAutoConfirm: Boolean(data.mailer_autoconfirm),
    });
  } catch {
    return NextResponse.json({ email: true, google: false }, { status: 200 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabase, attachCookies } from "@/lib/supabase/server";
import { getRegistrationClose, registrationClosed } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { provider, next, mode } = await req.json();

    if (provider !== "google") {
      return NextResponse.json({ error: "Unsupported sign-in provider." }, { status: 400 });
    }

    // Only the registration flow is gated — existing users can still sign in.
    if (mode === "register") {
      const registrationCloses = await getRegistrationClose();
      if (Date.now() > registrationCloses.getTime()) {
        return registrationClosed(registrationCloses);
      }
    }

    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(typeof next === "string" && next.startsWith("/") ? next : "/dashboard")}`;

    const { supabase, pending } = createRouteSupabase();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error || !data.url) {
      return NextResponse.json(
        { error: error?.message || "Could not start Google sign-in. It may not be configured yet." },
        { status: 400 }
      );
    }

    // Important: attach auth cookies so PKCE verifier is available at /auth/callback
    return attachCookies(NextResponse.json({ success: true, url: data.url }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

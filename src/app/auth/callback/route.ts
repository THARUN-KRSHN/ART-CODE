import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabase, attachCookies } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const safeNext = next && next.startsWith("/") ? next : "/dashboard";
  const errorRedirect = `${origin}/login?error=${encodeURIComponent(errorDescription || error || "auth_code_exchange_failed")}`;

  if (!code) {
    return NextResponse.redirect(errorRedirect);
  }

  const { supabase, pending } = createRouteSupabase();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(errorRedirect);
  }

  const response = NextResponse.redirect(`${origin}${safeNext}`);
  return attachCookies(response, pending);
}

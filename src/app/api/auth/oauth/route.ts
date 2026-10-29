import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { provider, next } = await req.json();

    if (provider !== "google") {
      return NextResponse.json({ error: "Unsupported sign-in provider." }, { status: 400 });
    }

    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(typeof next === "string" && next.startsWith("/") ? next : "/dashboard")}`;

    const { supabase } = createRouteSupabase();
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

    return NextResponse.json({ success: true, url: data.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

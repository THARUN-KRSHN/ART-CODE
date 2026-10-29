import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabase, attachCookies } from "@/lib/supabase/server";
import { logAudit, resolveSessionForAuthUser, withCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const { supabase, pending } = createRouteSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error || !data.user) {
      const message =
        error?.message === "Email not confirmed"
          ? "This email has not been confirmed yet. Check your inbox for the confirmation link."
          : "Invalid email or password.";
      return NextResponse.json({ error: message }, { status: 401 });
    }

    const session = await resolveSessionForAuthUser(data.user, pending);
    if (!session) {
      return NextResponse.json({ error: "Account profile could not be found." }, { status: 404 });
    }

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "USER_LOGIN",
      `Participant signed in via email & password`
    );

    return withCookies(NextResponse.json({ success: true, user: session.user, isNew: false }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

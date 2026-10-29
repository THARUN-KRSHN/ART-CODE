import { NextRequest, NextResponse } from "next/server";
import { createRouteSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { logAudit, resolveSessionForAuthUser, withCookies } from "@/lib/auth";

const DEFAULT_INSTITUTION = "Christ College of Engineering (Autonomous), Irinjalakuda";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, institution } = await req.json();

    if (!name || String(name).trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!password || String(password).length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    const admin = createAdminSupabase();
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: String(email).trim(),
      password: String(password),
      email_confirm: true,
      user_metadata: { name: String(name).trim(), phone: phone || "" },
    });

    if (createError || !created.user) {
      const msg = createError?.message || "Could not create account.";
      if (msg.toLowerCase().includes("already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Try signing in instead." },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    await admin
      .from("profiles")
      .update({
        phone: phone ? String(phone).trim() : null,
        institution: institution ? String(institution).trim() : DEFAULT_INSTITUTION,
      })
      .eq("id", created.user.id);

    // Establish the session immediately (account is pre-confirmed).
    const { supabase, pending } = createRouteSupabase();
    const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (signInError || !signIn.user) {
      return NextResponse.json(
        { success: true, requiresLogin: true, message: "Account created. Please sign in." },
        { status: 201 }
      );
    }

    const session = await resolveSessionForAuthUser(signIn.user, pending);
    if (!session) {
      return NextResponse.json({ error: "Account profile could not be found." }, { status: 404 });
    }

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "USER_REGISTERED",
      "Registered new participant via email & password"
    );

    return withCookies(NextResponse.json({ success: true, user: session.user, isNew: true }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

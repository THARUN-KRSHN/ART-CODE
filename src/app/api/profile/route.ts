import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, logAudit, withCookies } from "@/lib/auth";
import { mapProfile, ProfileRow } from "@/lib/supabase/mappers";

const DEFAULT_INSTITUTION = "Christ College of Engineering (Autonomous), Irinjalakuda";

export async function GET() {
  const { session, pending } = await getSession();
  if (!session) {
    return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
  }
  return withCookies(NextResponse.json({ user: session.user }), pending);
}

export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
    }

    const { name, phone, institution, department, yearOfStudy } = await req.json();

    if (!name || String(name).trim().length < 2) {
      return withCookies(NextResponse.json({ error: "Please enter your full name." }, { status: 400 }), pending);
    }

    const admin = createAdminSupabase();
    const { data: updated, error } = await admin
      .from("profiles")
      .update({
        name: String(name).trim(),
        phone: phone ? String(phone).trim() : null,
        institution: institution ? String(institution).trim() : DEFAULT_INSTITUTION,
        department: department ? String(department).trim() : null,
        year_of_study: yearOfStudy || null,
      })
      .eq("id", session.userId)
      .select("*")
      .single<ProfileRow>();

    if (error || !updated) {
      return withCookies(NextResponse.json({ error: "Could not update profile." }, { status: 500 }), pending);
    }

    const user = mapProfile(updated, session.role);

    await logAudit(
      { name: user.name, email: user.email },
      "PROFILE_UPDATED",
      `Updated profile details (${user.institution})`
    );

    return withCookies(NextResponse.json({ success: true, user }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

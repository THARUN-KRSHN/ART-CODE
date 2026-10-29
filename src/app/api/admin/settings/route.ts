import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, logAudit, withCookies } from "@/lib/auth";
import { mapSettings, SettingsRow } from "@/lib/supabase/mappers";

export async function GET() {
  const admin = createAdminSupabase();
  const { data } = await admin.from("event_settings").select("*").eq("id", 1).maybeSingle<SettingsRow>();
  return NextResponse.json({ settings: data ? mapSettings(data) : null });
}

export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session || session.role !== "admin") {
      return withCookies(forbidden(), pending);
    }

    const body = await req.json();
    const admin = createAdminSupabase();

    const patch: Partial<SettingsRow> = {};
    if (body.eventName) patch.event_name = String(body.eventName);
    if (body.tagline) patch.tagline = String(body.tagline);
    if (body.organiser) patch.organiser = String(body.organiser);
    if (body.institution) patch.institution = String(body.institution);
    if (body.department) patch.department = String(body.department);
    if (body.theme) patch.theme = String(body.theme);
    if (body.registrationOpens) patch.registration_opens = new Date(body.registrationOpens).toISOString();
    if (body.submissionOpens) patch.submission_opens = new Date(body.submissionOpens).toISOString();
    if (body.submissionDeadline) patch.submission_deadline = new Date(body.submissionDeadline).toISOString();
    if (body.winnerAnnouncement) patch.winner_announcement = new Date(body.winnerAnnouncement).toISOString();
    if (typeof body.teamSize === "number") patch.team_size = body.teamSize;
    if (body.firstPrize) patch.first_prize = String(body.firstPrize);
    if (body.secondPrize) patch.second_prize = String(body.secondPrize);
    if (body.thirdPrize) patch.third_prize = String(body.thirdPrize);
    if (body.totalPrizePool) patch.total_prize_pool = String(body.totalPrizePool);
    if (body.facultyCoordinators) patch.faculty_coordinators = String(body.facultyCoordinators);
    if (body.studentCoordinators) patch.student_coordinators = String(body.studentCoordinators);
    if (body.contactEmail) patch.contact_email = String(body.contactEmail);
    if (typeof body.resultsPublished === "boolean") patch.results_published = body.resultsPublished;

    const { data, error } = await admin
      .from("event_settings")
      .update(patch)
      .eq("id", 1)
      .select("*")
      .single<SettingsRow>();

    if (error || !data) {
      return withCookies(NextResponse.json({ error: error?.message || "Could not update settings." }, { status: 400 }), pending);
    }

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "EVENT_SETTINGS_UPDATED",
      "Updated event deadlines, prize pool, or event configurations"
    );

    return withCookies(NextResponse.json({ success: true, settings: mapSettings(data) }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, forbidden, withCookies, getSettings } from "@/lib/auth";
import { finalDayReminderTemplate, sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") return withCookies(forbidden(), pending);

  const force = req.nextUrl.searchParams.get("force") === "1";
  const admin = createAdminSupabase();
  const settings = await getSettings();
  const deadline = new Date(settings.submissionDeadline);
  const now = new Date();
  const msLeft = deadline.getTime() - now.getTime();
  const within36h = msLeft <= 36 * 3600 * 1000 && msLeft > -1; // before deadline

  if (!force && !within36h) {
    return withCookies(
      NextResponse.json({ skipped: true, reason: "Not within 36h of deadline (use ?force=1 to override)." }),
      pending
    );
  }

  const { data: teams } = await admin.from("teams").select("id,name,status");
  const teamIds = (teams || []).map((t: any) => t.id);
  const { data: subs } = await admin.from("submissions").select("team_id,is_locked").in("team_id", teamIds);
  const lockedByTeam = new Map((subs || []).map((s: any) => [s.team_id, Boolean(s.is_locked)]));

  const pendingTeams = (teams || []).filter((t: any) => !lockedByTeam.get(t.id));
  if (pendingTeams.length === 0) {
    return withCookies(NextResponse.json({ success: true, sent: 0 }), pending);
  }

  const ids = pendingTeams.map((t: any) => t.id);
  const { data: members } = await admin
    .from("team_members")
    .select("team_id, profiles(email)")
    .in("team_id", ids);

  const emailsByTeam = new Map<string, Set<string>>();
  (members || []).forEach((m: any) => {
    const set = emailsByTeam.get(m.team_id) || new Set<string>();
    if (m.profiles?.email) set.add(m.profiles.email);
    emailsByTeam.set(m.team_id, set);
  });

  const deadlineLocal = deadline.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const tpl = finalDayReminderTemplate(deadlineLocal);

  let sent = 0;
  for (const team of pendingTeams) {
    const to = Array.from(emailsByTeam.get(team.id) || []);
    if (to.length === 0) continue;
    const res = await sendEmail({ to, subject: tpl.subject, html: tpl.html, text: tpl.text });
    if (res.ok) sent += to.length;
  }

  return withCookies(NextResponse.json({ success: true, teams: pendingTeams.length, sent }), pending);
}

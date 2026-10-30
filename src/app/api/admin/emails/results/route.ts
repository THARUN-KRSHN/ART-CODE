import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, withCookies } from "@/lib/auth";
import { winnersAnnouncementTemplate, sendEmail } from "@/lib/email";

export async function POST() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") return withCookies(forbidden(), pending);

  const admin = createAdminSupabase();
  const { data: winners } = await admin
    .from("winners")
    .select("rank, team_name, project_title")
    .lte("rank", 3)
    .order("rank", { ascending: true });

  if (!winners || winners.length === 0) {
    return withCookies(NextResponse.json({ success: false, error: "No winners configured." }, { status: 400 }), pending);
  }

  let totalSent = 0;
  for (const w of winners as any[]) {
    // Resolve team by exact name to fetch member emails
    const { data: team } = await admin.from("teams").select("id,name").eq("name", w.team_name).maybeSingle();
    if (!team) continue;
    const { data: members } = await admin
      .from("team_members")
      .select("profiles(email)")
      .eq("team_id", team.id);
    const to = (members || []).map((m: any) => m.profiles?.email).filter(Boolean);
    if (to.length === 0) continue;
    const tpl = winnersAnnouncementTemplate(Number(w.rank), w.team_name, w.project_title || "Project");
    const res = await sendEmail({ to, subject: tpl.subject, html: tpl.html, text: tpl.text });
    if (res.ok) totalSent += to.length;
  }

  return withCookies(NextResponse.json({ success: true, sent: totalSent }), pending);
}

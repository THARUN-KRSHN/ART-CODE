import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, loadTeam, logAudit, withCookies } from "@/lib/auth";
import { mapSubmission, SubmissionRow } from "@/lib/supabase/mappers";

export async function GET() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") {
    return withCookies(forbidden(), pending);
  }

  const admin = createAdminSupabase();
  const { data: subRows } = await admin
    .from("submissions")
    .select("*")
    .order("updated_at", { ascending: false });

  const submissions = await Promise.all(
    (subRows || []).map(async (s: any) => {
      const team = await loadTeam(s.team_id);
      return mapSubmission(s as SubmissionRow, team?.name, undefined);
    })
  );

  const { data: teamRows } = await admin.from("teams").select("*");
  const teams = await Promise.all((teamRows || []).map((t: any) => loadTeam(t.id)));

  return withCookies(NextResponse.json({ submissions, teams }), pending);
}

// POST: Administrative action to reopen or update a submission
export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session || session.role !== "admin") {
      return withCookies(forbidden(), pending);
    }

    const { action, submissionId, reason } = await req.json();
    const admin = createAdminSupabase();
    const { data: sub } = await admin.from("submissions").select("*").eq("id", String(submissionId)).maybeSingle<SubmissionRow>();

    if (!sub) {
      return withCookies(NextResponse.json({ error: "Submission not found." }, { status: 404 }), pending);
    }

    const team = await loadTeam(sub.team_id);
    const teamName = team?.name || "(unknown team)";

    if (action === "reopen") {
      await admin
        .from("submissions")
        .update({ is_locked: false, status: "draft", updated_at: new Date().toISOString() })
        .eq("id", sub.id);

      await logAudit(
        { name: session.user.name, email: session.user.email },
        "ADMIN_REOPEN_SUBMISSION",
        `Admin unlocked submission for team "${teamName}" (Ref: ${sub.reference_id}). Reason: ${reason || "Administrative exception"}`
      );

      return withCookies(
        NextResponse.json({ success: true, message: `Submission reopened for ${teamName}. Team leader can now edit.` }),
        pending
      );
    }

    if (action === "lock") {
      await admin
        .from("submissions")
        .update({ is_locked: true, status: "submitted", updated_at: new Date().toISOString() })
        .eq("id", sub.id);

      await logAudit(
        { name: session.user.name, email: session.user.email },
        "ADMIN_LOCK_SUBMISSION",
        `Admin locked submission for team "${teamName}" (Ref: ${sub.reference_id}).`
      );

      return withCookies(NextResponse.json({ success: true, message: `Submission locked for ${teamName}.` }), pending);
    }

    return withCookies(NextResponse.json({ error: "Unsupported administrative action." }, { status: 400 }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

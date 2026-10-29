import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, withCookies } from "@/lib/auth";
import { mapAudit, mapProblem, mapSettings, AuditRow, ProblemRow, SettingsRow } from "@/lib/supabase/mappers";

export async function GET() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") {
    return withCookies(forbidden(), pending);
  }

  const admin = createAdminSupabase();

  const [{ data: pCount }, { data: tCount }, { data: tComplete }, { data: tIncomplete }, { data: sDraft }, { data: sFinal }] = await Promise.all([
    admin.from("profiles").select("id").neq("role", "admin"),
    admin.from("teams").select("id"),
    admin.from("teams").select("id").eq("status", "complete"),
    admin.from("teams").select("id").eq("status", "incomplete"),
    admin.from("submissions").select("id").eq("status", "draft").eq("is_locked", false),
    admin.from("submissions").select("id").or("status.eq.submitted,is_locked.eq.true"),
  ]);

  const { data: problems } = await admin.from("problem_statements").select("id, code, title, category");
  const challengeStats = await Promise.all(
    (problems || []).map(async (c: any) => {
      const [{ data: all }, { data: locked }] = await Promise.all([
        admin.from("submissions").select("id").eq("challenge_id", c.id),
        admin
          .from("submissions")
          .select("id")
          .eq("challenge_id", c.id)
          .or("status.eq.submitted,is_locked.eq.true"),
      ]);
      return {
        challengeId: c.id,
        code: c.code,
        title: c.title,
        category: c.category,
        count: all?.length ?? 0,
        finalCount: locked?.length ?? 0,
      };
    })
  );

  const { data: audits } = await admin
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(10);
  const { data: settingsRow } = await admin.from("event_settings").select("*").eq("id", 1).maybeSingle<SettingsRow>();

  return withCookies(
    NextResponse.json({
      stats: {
        totalParticipants: pCount?.length ?? 0,
        totalTeams: tCount?.length ?? 0,
        completeTeams: tComplete?.length ?? 0,
        incompleteTeams: tIncomplete?.length ?? 0,
        draftSubmissions: sDraft?.length ?? 0,
        finalSubmissions: sFinal?.length ?? 0,
      },
      challengeStats,
      recentActivity: (audits || []).map((a) => mapAudit(a as AuditRow)),
      settings: settingsRow ? mapSettings(settingsRow) : null,
    }),
    pending
  );
}

import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, loadTeam, withCookies } from "@/lib/auth";

export async function GET() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") {
    return withCookies(forbidden(), pending);
  }

  const admin = createAdminSupabase();
  const { data: teamRows } = await admin.from("teams").select("*").order("created_at", { ascending: true });

  const teams = await Promise.all(
    (teamRows || []).map(async (t: any) => {
      const team = await loadTeam(t.id);
      const [{ data: sub }, { data: prob }] = await Promise.all([
        admin
          .from("submissions")
          .select("id, status, is_locked, reference_id, project_title")
          .eq("team_id", t.id)
          .maybeSingle(),
        t.selected_challenge_id
          ? admin
              .from("problem_statements")
              .select("title")
              .eq("id", t.selected_challenge_id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      return {
        ...(team as any),
        challengeTitle: prob?.title || "Not selected",
        submissionStatus: sub?.status || "not_started",
        submissionLocked: Boolean(sub?.is_locked),
        submissionRef: sub?.reference_id || null,
        submissionTitle: sub?.project_title || null,
      };
    })
  );

  return withCookies(NextResponse.json({ teams }), pending);
}

import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, withCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface FeedbackRow {
  id: string;
  user_id: string;
  team_id: string | null;
  answers: Record<string, string | number>;
  question_set_version: string;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") {
    return withCookies(forbidden(), pending);
  }

  try {
    const admin = createAdminSupabase();
    const [{ data: rows, error }, { data: profiles }, { data: teams }] = await Promise.all([
      admin
        .from("event_feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<FeedbackRow[]>(),
      admin.from("profiles").select("id, name, email"),
      admin.from("teams").select("id, name"),
    ]);

    if (error) {
      return withCookies(NextResponse.json({ error: error.message, responses: [] }), pending);
    }

    const profileById = new Map((profiles || []).map((p: any) => [p.id, p]));
    const teamById = new Map((teams || []).map((t: any) => [t.id, t]));

    const responses = (rows || []).map((row) => {
      const profile: any = profileById.get(row.user_id);
      const team: any = row.team_id ? teamById.get(row.team_id) : null;
      return {
        id: row.id,
        userId: row.user_id,
        name: profile?.name || "(unknown participant)",
        email: profile?.email || "",
        teamName: team?.name || "—",
        answers: row.answers || {},
        questionSetVersion: row.question_set_version,
        submittedAt: row.updated_at || row.created_at,
      };
    });

    return withCookies(NextResponse.json({ responses }), pending);
  } catch (err: any) {
    return withCookies(NextResponse.json({ error: err.message, responses: [] }, { status: 500 }), pending);
  }
}

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

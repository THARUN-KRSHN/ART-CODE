import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, loadTeam, logAudit, withCookies } from "@/lib/auth";
import { mapProblem, ProblemRow } from "@/lib/supabase/mappers";

async function findChallenge(identifier: string): Promise<ProblemRow | null> {
  if (!/^[A-Za-z0-9_-]+$/.test(identifier)) return null;
  const admin = createAdminSupabase();
  const bySlug = await admin
    .from("problem_statements")
    .select("*")
    .eq("slug", identifier)
    .eq("is_published", true)
    .maybeSingle<ProblemRow>();
  if (bySlug.data) return bySlug.data;

  const byId = await admin
    .from("problem_statements")
    .select("*")
    .or(`id.eq.${identifier},code.eq.${identifier.toUpperCase()}`)
    .eq("is_published", true)
    .maybeSingle<ProblemRow>();
  return byId.data;
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const row = await findChallenge(params.slug);
    if (!row) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const { session } = await getSession();
    const team = session?.profile.team_id ? await loadTeam(session.profile.team_id) : null;
    const isSelectedByTeam = team?.selectedChallengeId === row.id;

    return NextResponse.json({
      challenge: mapProblem(row),
      team,
      isSelectedByTeam,
      canSelect: Boolean(session && team && team.leaderId === session.userId),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Select challenge for the team
export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
    }

    if (!session.profile.team_id) {
      return withCookies(
        NextResponse.json({ error: "You must belong to a team to select a challenge." }, { status: 400 }),
        pending
      );
    }

    const team = await loadTeam(session.profile.team_id);
    if (!team) {
      return withCookies(NextResponse.json({ error: "Team not found." }, { status: 404 }), pending);
    }

    if (team.leaderId !== session.userId) {
      return withCookies(
        NextResponse.json({ error: "Only the Team Leader can change the team's selected challenge." }, { status: 403 }),
        pending
      );
    }

    const row = await findChallenge(params.slug);
    if (!row) {
      return withCookies(NextResponse.json({ error: "Challenge not found." }, { status: 404 }), pending);
    }

    const admin = createAdminSupabase();
    await admin.from("teams").update({ selected_challenge_id: row.id }).eq("id", team.id);

    const { data: draft } = await admin
      .from("submissions")
      .select("id, is_locked")
      .eq("team_id", team.id)
      .maybeSingle();

    if (draft && !draft.is_locked) {
      await admin.from("submissions").update({ challenge_id: row.id }).eq("id", draft.id);
    }

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "CHALLENGE_SELECTED",
      `Team "${team.name}" selected challenge ${row.code}: "${row.title}"`
    );

    return withCookies(
      NextResponse.json({ success: true, message: `Selected ${row.code} for team "${team.name}"` }),
      pending
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

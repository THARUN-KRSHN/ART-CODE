import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, loadTeam, logAudit, withCookies } from "@/lib/auth";
import { mapProblem, mapSubmission, ProblemRow, SubmissionRow } from "@/lib/supabase/mappers";
import { ProjectSubmission } from "@/types";

// GET current submission for active user's team
export async function GET() {
  const { session, pending } = await getSession();
  if (!session) {
    return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
  }

  if (!session.profile.team_id) {
    return withCookies(NextResponse.json({ submission: null, team: null, user: session.user }), pending);
  }

  const admin = createAdminSupabase();
  const team = await loadTeam(session.profile.team_id);
  const { data: subRow } = await admin
    .from("submissions")
    .select(
      "id, team_id, challenge_id, project_title, short_description, problem_description, proposed_solution, key_features, tech_stack, innovation_and_impact, github_url, live_url, google_drive_url, additional_comments, status, reference_id, acknowledged, submitted_at, submitted_by, is_locked, updated_at"
    )
    .eq("team_id", session.profile.team_id)
    .maybeSingle<SubmissionRow>();

  let submission: ProjectSubmission | null = null;
  if (subRow) {
    // Resolve titles
    const { data: prob } = await admin
      .from("problem_statements")
      .select("title")
      .eq("id", subRow.challenge_id)
      .maybeSingle<Pick<ProblemRow, "title">>();
    submission = mapSubmission(subRow, team?.name, prob?.title || "");
  }

  return withCookies(NextResponse.json({ submission, team, user: session.user }), pending);
}

// POST: Save draft submission (Leader only!)
export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
    }

    if (!session.profile.team_id) {
      return withCookies(NextResponse.json({ error: "You must belong to a team to submit." }, { status: 400 }), pending);
    }

    const admin = createAdminSupabase();
    const team = await loadTeam(session.profile.team_id);
    if (!team) {
      return withCookies(NextResponse.json({ error: "Team not found." }, { status: 404 }), pending);
    }

    // Role check: Only Team Leader can edit drafts
    if (team.leaderId !== session.userId) {
      return withCookies(
        NextResponse.json(
          { error: "Only the Team Leader can edit the draft submission. Teammates can view status." },
          { status: 403 }
        ),
        pending
      );
    }

    const payload = await req.json();

    // Determine challenge
    const selectedChallengeId = payload.challengeId || team.selectedChallengeId;
    let challengeTitle = "";
    if (selectedChallengeId) {
      const { data: prob } = await admin
        .from("problem_statements")
        .select("title")
        .eq("id", selectedChallengeId)
        .maybeSingle<Pick<ProblemRow, "title">>();
      challengeTitle = prob?.title || "";
    }

    // Existing draft?
    const { data: existing } = await admin
      .from("submissions")
      .select("*")
      .eq("team_id", team.id)
      .maybeSingle<SubmissionRow>();

    if (existing && existing.is_locked) {
      return withCookies(
        NextResponse.json(
          { error: "This project has already been submitted and locked. Contact event administrators for exceptions." },
          { status: 400 }
        ),
        pending
      );
    }

    const refId = existing?.reference_id || `AC26-SUB-${Math.floor(1000 + Math.random() * 9000)}`;

    const upsertPayload = {
      id: existing?.id,
      team_id: team.id,
      challenge_id: selectedChallengeId,
      project_title: String(payload.projectTitle || ""),
      short_description: String(payload.shortDescription || ""),
      problem_description: String(payload.problemDescription || ""),
      proposed_solution: String(payload.proposedSolution || ""),
      key_features: Array.isArray(payload.keyFeatures) ? payload.keyFeatures : [],
      tech_stack: Array.isArray(payload.techStack) ? payload.techStack : [],
      innovation_and_impact: String(payload.innovationAndImpact || ""),
      github_url: String(payload.githubUrl || ""),
      live_url: payload.liveUrl ? String(payload.liveUrl) : null,
      google_drive_url: String(payload.googleDriveUrl || ""),
      additional_comments: payload.additionalComments ? String(payload.additionalComments) : null,
      status: "draft",
      reference_id: refId,
      acknowledged: Boolean(payload.acknowledged),
      is_locked: false,
      updated_at: new Date().toISOString(),
    } as Partial<SubmissionRow>;

    // Update team's selected challenge if provided
    if (payload.challengeId) {
      await admin.from("teams").update({ selected_challenge_id: payload.challengeId }).eq("id", team.id);
    }

    const { data: upserted, error } = await admin
      .from("submissions")
      .upsert(upsertPayload, { onConflict: "team_id" })
      .select("*")
      .maybeSingle<SubmissionRow>();

    if (error || !upserted) {
      return withCookies(NextResponse.json({ error: error?.message || "Could not save draft" }, { status: 400 }), pending);
    }

    const submission = mapSubmission(upserted, team.name, challengeTitle);

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "DRAFT_SAVED",
      `Saved draft submission for team "${team.name}" (${submission.projectTitle || "Untitled"})`
    );

    return withCookies(NextResponse.json({ success: true, submission }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

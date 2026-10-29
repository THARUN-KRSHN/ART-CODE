import { NextRequest, NextResponse } from "next/server";
import { getChallengeById, getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const challenge = getChallengeById(params.slug);
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const activeUser = getActiveUser();
  const data = loadData();
  const team = activeUser?.teamId ? data.teams.find((t) => t.id === activeUser.teamId) : null;
  const isSelectedByTeam = team?.selectedChallengeId === challenge.id;

  return NextResponse.json({
    challenge,
    team,
    isSelectedByTeam,
    canSelect: activeUser && team && team.leaderId === activeUser.id,
  });
}

// POST: Select challenge for the team
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = loadData();
    const team = data.teams.find((t) => t.id === activeUser.teamId);
    if (!team) {
      return NextResponse.json({ error: "You must belong to a team to select a challenge." }, { status: 400 });
    }

    if (team.leaderId !== activeUser.id) {
      return NextResponse.json({ error: "Only the Team Leader can change the team's selected challenge." }, { status: 403 });
    }

    const challenge = data.challenges.find((c) => c.slug === params.slug || c.id === params.slug);
    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
    }

    team.selectedChallengeId = challenge.id;

    // Also update existing draft submission if one exists
    const sub = data.submissions.find((s) => s.teamId === team.id);
    if (sub && !sub.isLocked) {
      sub.challengeId = challenge.id;
      sub.challengeTitle = challenge.title;
      sub.updatedAt = new Date().toISOString();
    }

    saveData(data);

    addAuditLog(
      activeUser.name,
      activeUser.email,
      "CHALLENGE_SELECTED",
      `Team "${team.name}" selected challenge ${challenge.code}: "${challenge.title}"`
    );

    return NextResponse.json({ success: true, message: `Selected ${challenge.code} for team "${team.name}"` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


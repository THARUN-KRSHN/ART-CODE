import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";
import { ProjectSubmission } from "@/types";

// GET current submission for active user's team
export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!activeUser.teamId) {
    return NextResponse.json({ submission: null, team: null });
  }

  const data = loadData();
  const team = data.teams.find((t) => t.id === activeUser.teamId);
  const submission = data.submissions.find((s) => s.teamId === activeUser.teamId) || null;

  return NextResponse.json({ submission, team, user: activeUser });
}

// POST: Save draft submission (Leader only!)
export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!activeUser.teamId) {
      return NextResponse.json({ error: "You must belong to a team to submit." }, { status: 400 });
    }

    const data = loadData();
    const team = data.teams.find((t) => t.id === activeUser.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Role check: Only Team Leader can edit drafts
    if (team.leaderId !== activeUser.id) {
      return NextResponse.json(
        { error: "Only the Team Leader can edit the draft submission. Teammates can view status." },
        { status: 403 }
      );
    }

    const existingSubmission = data.submissions.find((s) => s.teamId === team.id);

    // If locked, reject edits
    if (existingSubmission && existingSubmission.isLocked) {
      return NextResponse.json(
        { error: "This project has already been submitted and locked. Contact event administrators for exceptions." },
        { status: 400 }
      );
    }

    const payload = await req.json();
    const challenge = data.challenges.find((c) => c.id === payload.challengeId);

    const submissionId = existingSubmission ? existingSubmission.id : `sub-${Date.now().toString(36)}`;
    const updatedSubmission: ProjectSubmission = {
      id: submissionId,
      teamId: team.id,
      teamName: team.name,
      challengeId: payload.challengeId || team.selectedChallengeId || "ch-01",
      challengeTitle: challenge?.title || "Living Archives: Generative AI for Indigenous Mural & Fresco Restoration",
      projectTitle: payload.projectTitle || "",
      shortDescription: payload.shortDescription || "",
      problemDescription: payload.problemDescription || "",
      proposedSolution: payload.proposedSolution || "",
      keyFeatures: Array.isArray(payload.keyFeatures) ? payload.keyFeatures : [],
      techStack: Array.isArray(payload.techStack) ? payload.techStack : [],
      innovationAndImpact: payload.innovationAndImpact || "",
      githubUrl: payload.githubUrl || "",
      liveUrl: payload.liveUrl || "",
      googleDriveUrl: payload.googleDriveUrl || "",
      additionalComments: payload.additionalComments || "",
      status: "draft",
      referenceId: existingSubmission?.referenceId || `AC26-SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      acknowledged: Boolean(payload.acknowledged),
      isLocked: false,
      updatedAt: new Date().toISOString(),
    };

    // Update team's selected challenge
    if (payload.challengeId) {
      team.selectedChallengeId = payload.challengeId;
    }

    const existingIdx = data.submissions.findIndex((s) => s.teamId === team.id);
    if (existingIdx >= 0) {
      data.submissions[existingIdx] = updatedSubmission;
    } else {
      data.submissions.push(updatedSubmission);
    }

    saveData(data);

    addAuditLog(
      activeUser.name,
      activeUser.email,
      "DRAFT_SAVED",
      `Saved draft submission for team "${team.name}" (${updatedSubmission.projectTitle || "Untitled"})`
    );

    return NextResponse.json({ success: true, submission: updatedSubmission });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


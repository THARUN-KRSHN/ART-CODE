import { NextResponse } from "next/server";
import { getActiveUser, loadData } from "@/lib/store";

export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser || activeUser.role !== "admin") {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const data = loadData();
  const teamsWithDetails = data.teams.map((t) => {
    const submission = data.submissions.find((s) => s.teamId === t.id);
    const challenge = data.challenges.find((c) => c.id === t.selectedChallengeId);
    return {
      ...t,
      challengeTitle: challenge?.title || "Not selected",
      submissionStatus: submission ? submission.status : "not_started",
      submissionLocked: submission?.isLocked || false,
      submissionRef: submission?.referenceId || null,
      submissionTitle: submission?.projectTitle || null,
    };
  });

  return NextResponse.json({ teams: teamsWithDetails });
}


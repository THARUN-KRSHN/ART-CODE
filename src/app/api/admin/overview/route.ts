import { NextResponse } from "next/server";
import { getActiveUser, loadData } from "@/lib/store";

export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser || activeUser.role !== "admin") {
    return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
  }

  const data = loadData();

  const totalParticipants = data.users.filter((u) => u.role !== "admin").length;
  const totalTeams = data.teams.length;
  const completeTeams = data.teams.filter((t) => t.status === "complete").length;
  const incompleteTeams = data.teams.filter((t) => t.status === "incomplete").length;
  const draftSubmissions = data.submissions.filter((s) => s.status === "draft").length;
  const finalSubmissions = data.submissions.filter((s) => s.status === "submitted" || s.isLocked).length;

  // Submissions per challenge
  const challengeStats = data.challenges.map((c) => {
    const subs = data.submissions.filter((s) => s.challengeId === c.id);
    return {
      challengeId: c.id,
      code: c.code,
      title: c.title,
      category: c.category,
      count: subs.length,
      finalCount: subs.filter((s) => s.isLocked).length,
    };
  });

  return NextResponse.json({
    stats: {
      totalParticipants,
      totalTeams,
      completeTeams,
      incompleteTeams,
      draftSubmissions,
      finalSubmissions,
    },
    challengeStats,
    recentActivity: data.auditLogs.slice(0, 10),
    settings: data.settings,
  });
}


import { NextResponse } from "next/server";
import { getActiveUser, loadData } from "@/lib/store";

export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser || activeUser.role !== "admin") {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const data = loadData();
  const participants = data.users.map((u) => {
    const team = u.teamId ? data.teams.find((t) => t.id === u.teamId) : null;
    return {
      ...u,
      teamName: team?.name || null,
      teamStatus: team?.status || "no_team",
    };
  });

  return NextResponse.json({ participants });
}


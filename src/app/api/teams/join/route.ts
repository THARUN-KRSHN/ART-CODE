import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser) {
      return NextResponse.json({ error: "You must be signed in to join a team." }, { status: 401 });
    }

    const { invitationCode } = await req.json();
    if (!invitationCode || !invitationCode.trim()) {
      return NextResponse.json({ error: "Please provide a valid invitation code." }, { status: 400 });
    }

    const data = loadData();
    const currentUser = data.users.find((u) => u.id === activeUser.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    // Check if user is already in a team
    if (currentUser.teamId) {
      const currentTeam = data.teams.find((t) => t.id === currentUser.teamId);
      return NextResponse.json(
        {
          error: `You are already a member of "${currentTeam?.name || "another team"}". A participant can belong to only one active team.`,
        },
        { status: 400 }
      );
    }

    // Find team by invitation code
    const cleanCode = invitationCode.trim().toUpperCase();
    const team = data.teams.find((t) => t.invitationCode.toUpperCase() === cleanCode);

    if (!team) {
      return NextResponse.json(
        { error: "Invalid invitation code. No active team matches this code." },
        { status: 404 }
      );
    }

    // Check if team already has 2 members
    if (team.members.length >= 2) {
      return NextResponse.json(
        { error: `Team "${team.name}" is already complete with 2 members. Each team is strictly limited to 2 members.` },
        { status: 400 }
      );
    }

    // Check if user is somehow already in team's member list
    if (team.members.some((m) => m.userId === currentUser.id)) {
      return NextResponse.json({ error: "You are already a member of this team." }, { status: 400 });
    }

    // Add member
    team.members.push({
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      institution: currentUser.institution,
      department: currentUser.department,
      role: "member",
      joinedAt: new Date().toISOString(),
    });

    // Update team status
    team.status = team.members.length === 2 ? "complete" : "incomplete";

    // Update user record
    currentUser.teamId = team.id;
    currentUser.role = "participant";

    saveData(data);

    addAuditLog(
      currentUser.name,
      currentUser.email,
      "TEAM_JOINED",
      `Joined team "${team.name}" via code ${cleanCode}. Team is now ${team.status}.`
    );

    return NextResponse.json({ success: true, team });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


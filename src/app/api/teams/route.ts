import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";
import { Team } from "@/types";

// GET current user's team
export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = loadData();
  const team = activeUser.teamId ? data.teams.find((t) => t.id === activeUser.teamId) : null;

  return NextResponse.json({ team, user: activeUser });
}

// POST create team
export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser) {
      return NextResponse.json({ error: "You must be signed in to create a team" }, { status: 401 });
    }

    const data = loadData();
    const currentUser = data.users.find((u) => u.id === activeUser.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Check if user already belongs to an active team
    if (currentUser.teamId) {
      const existingTeam = data.teams.find((t) => t.id === currentUser.teamId);
      if (existingTeam) {
        return NextResponse.json(
          { error: `You are already a member of team "${existingTeam.name}". A participant can belong to only one team.` },
          { status: 400 }
        );
      }
    }

    const { name, selectedChallengeId } = await req.json();
    if (!name || name.trim().length < 3) {
      return NextResponse.json({ error: "Team name must be at least 3 characters long." }, { status: 400 });
    }

    // Check duplicate team name
    if (data.teams.some((t) => t.name.toLowerCase() === name.trim().toLowerCase())) {
      return NextResponse.json({ error: `Team name "${name}" is already taken. Please pick another name.` }, { status: 400 });
    }

    // Generate unique 6-character alphanumeric invitation code e.g. ART-9281
    let inviteCode = `ART-${Math.floor(1000 + Math.random() * 9000)}`;
    while (data.teams.some((t) => t.invitationCode === inviteCode)) {
      inviteCode = `ART-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const teamId = `team-${Date.now().toString(36)}`;
    const newTeam: Team = {
      id: teamId,
      name: name.trim(),
      leaderId: currentUser.id,
      invitationCode: inviteCode,
      selectedChallengeId: selectedChallengeId || null,
      status: "incomplete", // Needs 1 more member for exactly 2
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          institution: currentUser.institution,
          department: currentUser.department,
          role: "leader",
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    // Update user role to leader and assign teamId
    currentUser.teamId = teamId;
    currentUser.role = "leader";

    data.teams.push(newTeam);
    saveData(data);

    addAuditLog(
      currentUser.name,
      currentUser.email,
      "TEAM_CREATED",
      `Created team "${newTeam.name}" (Code: ${newTeam.invitationCode})`
    );

    return NextResponse.json({ success: true, team: newTeam });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


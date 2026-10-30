import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, loadTeam, logAudit, withCookies } from "@/lib/auth";
import { TeamRow } from "@/lib/supabase/mappers";
import { sendEmail, teamCreatedTemplate } from "@/lib/email";

function generateInviteCode(): string {
  return `ART-${Math.floor(1000 + Math.random() * 9000)}`;
}

// GET current user's team
export async function GET() {
  const { session, pending } = await getSession();
  if (!session) {
    return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
  }

  const team = session.profile.team_id ? await loadTeam(session.profile.team_id) : null;
  return withCookies(NextResponse.json({ team, user: session.user }), pending);
}

// POST create team
export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(
        NextResponse.json({ error: "You must be signed in to create a team" }, { status: 401 }),
        pending
      );
    }

    if (session.profile.team_id) {
      const existingTeam = await loadTeam(session.profile.team_id);
      if (existingTeam) {
        return withCookies(
          NextResponse.json(
            {
              error: `You are already a member of team "${existingTeam.name}". A participant can belong to only one team.`,
            },
            { status: 400 }
          ),
          pending
        );
      }
    }

    const { name, selectedChallengeId } = await req.json();
    if (!name || String(name).trim().length < 3) {
      return withCookies(
        NextResponse.json({ error: "Team name must be at least 3 characters long." }, { status: 400 }),
        pending
      );
    }

    const admin = createAdminSupabase();

    const { data: allTeams } = await admin.from("teams").select("id, name, invitation_code");
    const teamNames = new Set((allTeams || []).map((t) => t.name.toLowerCase()));
    if (teamNames.has(String(name).trim().toLowerCase())) {
      return withCookies(
        NextResponse.json({ error: `Team name "${name}" is already taken. Please pick another name.` }, { status: 400 }),
        pending
      );
    }

    const existingCodes = new Set((allTeams || []).map((t) => t.invitation_code));
    let inviteCode = generateInviteCode();
    while (existingCodes.has(inviteCode)) inviteCode = generateInviteCode();

    const { data: teamRow, error: teamError } = await admin
      .from("teams")
      .insert({
        name: String(name).trim(),
        leader_id: session.userId,
        invitation_code: inviteCode,
        selected_challenge_id: selectedChallengeId || null,
        status: "incomplete",
      })
      .select("*")
      .single<TeamRow>();

    if (teamError || !teamRow) {
      if (teamError?.code === "23505") {
        return withCookies(
          NextResponse.json({ error: `Team name "${name}" is already taken. Please pick another name.` }, { status: 400 }),
          pending
        );
      }
      throw new Error(teamError?.message || "Could not create team.");
    }

    const { error: memberError } = await admin.from("team_members").insert({
      team_id: teamRow.id,
      user_id: session.userId,
      role: "leader",
    });

    if (memberError) throw new Error(memberError.message);

    await admin.from("profiles").update({ team_id: teamRow.id }).eq("id", session.userId);

    const team = await loadTeam(teamRow.id);
    if (!team) throw new Error("Team not found after creation.");

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "TEAM_CREATED",
      `Created team "${teamRow.name}" (Code: ${teamRow.invitation_code})`
    );

    // Fire-and-forget leader notification
    try {
      const t = teamCreatedTemplate(teamRow.name, teamRow.invitation_code);
      await sendEmail({ to: [session.user.email], subject: t.subject, html: t.html, text: t.text });
    } catch (e) {
      console.warn("team created email failed", e);
    }

    return withCookies(NextResponse.json({ success: true, team }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

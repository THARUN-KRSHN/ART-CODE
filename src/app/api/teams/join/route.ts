import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, getSettings, loadTeam, logAudit, withCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(
        NextResponse.json({ error: "You must be signed in to join a team." }, { status: 401 }),
        pending
      );
    }

    const { invitationCode } = await req.json();
    if (!invitationCode || !String(invitationCode).trim()) {
      return withCookies(NextResponse.json({ error: "Please provide a valid invitation code." }, { status: 400 }), pending);
    }

    if (session.profile.team_id) {
      const currentTeam = await loadTeam(session.profile.team_id);
      return withCookies(
        NextResponse.json(
          {
            error: `You are already a member of "${currentTeam?.name || "another team"}". A participant can belong to only one active team.`,
          },
          { status: 400 }
        ),
        pending
      );
    }

    const admin = createAdminSupabase();
    const cleanCode = String(invitationCode).trim().toUpperCase();

    const { data: teamRow } = await admin
      .from("teams")
      .select("*")
      .eq("invitation_code", cleanCode)
      .maybeSingle<any>();

    if (!teamRow) {
      return withCookies(
        NextResponse.json({ error: "Invalid invitation code. No active team matches this code." }, { status: 404 }),
        pending
      );
    }

    const { data: members } = await admin.from("team_members").select("user_id").eq("team_id", teamRow.id);
    const memberCount = (members || []).length;
    const teamSize = (await getSettings()).teamSize;

    if (memberCount >= teamSize) {
      return withCookies(
        NextResponse.json(
          {
            error: `Team "${teamRow.name}" is already complete with ${teamSize} members. Each team is strictly limited to ${teamSize} members.`,
          },
          { status: 400 }
        ),
        pending
      );
    }

    if (members?.some((m) => m.user_id === session.userId)) {
      return withCookies(NextResponse.json({ error: "You are already a member of this team." }, { status: 400 }), pending);
    }

    const { error: joinError } = await admin.from("team_members").insert({
      team_id: teamRow.id,
      user_id: session.userId,
      role: "member",
    });

    if (joinError) {
      return withCookies(
        NextResponse.json({ error: joinError.message || "Could not join the team." }, { status: 400 }),
        pending
      );
    }

    await admin.from("profiles").update({ team_id: teamRow.id }).eq("id", session.userId);

    const team = await loadTeam(teamRow.id);
    if (!team) throw new Error("Team not found after joining.");

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "TEAM_JOINED",
      `Joined team "${team.name}" via code ${cleanCode}. Team is now ${team.status}.`
    );

    return withCookies(NextResponse.json({ success: true, team }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

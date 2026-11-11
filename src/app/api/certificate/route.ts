import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getSession, getSettings, loadTeamFromRow, withCookies } from "@/lib/auth";
import { TeamRow } from "@/lib/supabase/mappers";
import { Team } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Certificates become available after the event concludes.
 * The featured certificate template is unlocked from Nov 10 onward.
 *
 * Override with CERTIFICATE_OPENS (ISO date) to test or open early.
 */
const DEFAULT_CERTIFICATE_OPENS = "2026-11-10T00:00:00+05:30";

function certificateOpensAt(): Date {
  const raw = process.env.CERTIFICATE_OPENS || DEFAULT_CERTIFICATE_OPENS;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date(DEFAULT_CERTIFICATE_OPENS) : parsed;
}

function certificateWindow(now: Date = new Date()) {
  const opens = certificateOpensAt();
  return {
    opensAt: opens.toISOString(),
    isOpen: now.getTime() >= opens.getTime(),
  };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const teamId = url.searchParams.get("teamId");

  const { opensAt, isOpen } = certificateWindow();
  const { session, pending } = await getSession();
  const respond = (body: unknown, init?: ResponseInit) =>
    withCookies(NextResponse.json(body, init), pending);

  if (!isSupabaseConfigured()) {
    return respond({ available: true, opensAt, teams: [], settings: null });
  }

  if (!session) {
    return respond(
      { available: false, opensAt, error: "Sign in to access your certificate.", teams: [] },
      { status: 401 }
    );
  }

  // Certificates are gated on event feedback: no feedback, no certificate.
  try {
    const admin = createAdminSupabase();
    const { data: feedback, error: feedbackError } = await admin
      .from("event_feedback")
      .select("id")
      .eq("user_id", session.userId)
      .maybeSingle();

    if (feedbackError) {
      return respond(
        { available: false, opensAt, error: "Could not verify feedback status.", teams: [] },
        { status: 500 }
      );
    }

    if (!feedback) {
      return respond(
        {
          available: false,
          opensAt,
          error: "Submit the event feedback form to unlock your certificate.",
          teams: [],
        },
        { status: 403 }
      );
    }
  } catch (err: any) {
    return respond({ available: false, opensAt, error: err.message, teams: [] }, { status: 500 });
  }

  // Admins may preview the template before the public unlock date.
  const adminPreview = !isOpen && url.searchParams.get("preview") === "1" && session.role === "admin";

  if (!isOpen && !adminPreview) {
    return respond(
      {
        available: false,
        opensAt,
        error: "Certificates will be available from 10 November 2026.",
        teams: [],
      },
      { status: 403 }
    );
  }

  try {
    const admin = createAdminSupabase();
    const settings = await getSettings();

    // A specific team was requested: return its verified members for printing.
    if (teamId) {
      const { data: teamRow } = await admin
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .maybeSingle<TeamRow>();

      if (!teamRow) {
        return NextResponse.json({ available: true, opensAt, error: "Team not found." }, { status: 404 });
      }

      const team: Team = await loadTeamFromRow(teamRow);

      // Only teams that actually submitted are eligible for a certificate.
      const { data: sub } = await admin
        .from("submissions")
        .select("project_title, status, reference_id, challenge_id")
        .eq("team_id", team.id)
        .maybeSingle();

      let challengeTitle = "";
      if (sub?.challenge_id) {
        const { data: prob } = await admin
          .from("problem_statements")
          .select("title, code")
          .eq("id", sub.challenge_id)
          .maybeSingle<{ title: string; code: string }>();
        challengeTitle = prob ? `${prob.code} · ${prob.title}` : "";
      }

      return NextResponse.json({
        available: true,
        opensAt,
        settings,
        team: {
          id: team.id,
          name: team.name,
          members: team.members.map((m) => ({
            userId: m.userId,
            name: m.name,
            role: m.role,
            institution: m.institution,
            department: m.department || "",
          })),
          projectTitle: sub?.project_title || "",
          challengeTitle,
          referenceId: sub?.reference_id || "",
          hasSubmission: Boolean(sub),
        },
      });
    }

    // No team specified: list teams that have a submission (for the picker).
    const [{ data: teams }, { data: subs }] = await Promise.all([
      admin.from("teams").select("id, name").order("name"),
      admin.from("submissions").select("team_id, project_title"),
    ]);

    const subByTeam = new Map((subs || []).map((s: any) => [s.team_id, s.project_title]));

    return NextResponse.json({
      available: true,
      opensAt,
      settings,
      teams: (teams || [])
        .filter((t: any) => subByTeam.has(t.id))
        .map((t: any) => ({ id: t.id, name: t.name, projectTitle: subByTeam.get(t.id) || "" })),
    });
  } catch (err: any) {
    return NextResponse.json({ available: true, opensAt, error: err.message }, { status: 500 });
  }
}

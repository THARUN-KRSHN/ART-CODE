import { NextResponse } from "next/server";
import { createRouteSupabase, PendingCookie, attachCookies } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  mapProfile,
  mapSettings,
  mapTeam,
  ProfileRow,
  SettingsRow,
  TeamMemberRow,
  TeamRow,
} from "@/lib/supabase/mappers";
import { EventSettings, Team, UserProfile, UserRole } from "@/types";

export interface SessionContext {
  userId: string;
  email: string;
  profile: ProfileRow;
  user: UserProfile;
  role: UserRole;
  isTeamLeader: boolean;
  pending: PendingCookie[];
}

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Builds a session context for an already-authenticated Supabase auth user:
 * loads the profile, bootstraps admin access from ADMIN_EMAILS, and resolves
 * the effective role (admin > team leader > participant).
 */
export async function resolveSessionForAuthUser(
  authUser: { id: string },
  pending: PendingCookie[]
): Promise<SessionContext | null> {
  const admin = createAdminSupabase();
  const { data: profile, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle<ProfileRow>();

  if (error || !profile) return null;

  let role: UserRole = profile.role === "admin" ? "admin" : "participant";

  if (role !== "admin" && adminEmails().includes(profile.email.toLowerCase())) {
    role = "admin";
    await admin.from("profiles").update({ role: "admin" }).eq("id", profile.id);
    profile.role = "admin";
  }

  let isTeamLeader = false;
  if (profile.team_id) {
    const { data: membership } = await admin
      .from("team_members")
      .select("role")
      .eq("user_id", profile.id)
      .eq("team_id", profile.team_id)
      .maybeSingle();
    isTeamLeader = membership?.role === "leader";
  }

  if (role !== "admin" && isTeamLeader) role = "leader";

  return {
    userId: profile.id,
    email: profile.email,
    profile,
    user: mapProfile(profile, role),
    role,
    isTeamLeader,
    pending,
  };
}

/**
 * Resolves the signed-in user from auth cookies (also performs token refresh;
 * queued cookies must be attached to the outgoing response).
 */
export async function getSession(): Promise<{ session: SessionContext | null; pending: PendingCookie[] }> {
  const { supabase, pending } = createRouteSupabase();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return { session: null, pending };

  const session = await resolveSessionForAuthUser(authUser, pending);
  return { session, pending };
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Access denied. Administrator privileges required."): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function requireSession(): Promise<
  { session: SessionContext; pending: PendingCookie[]; error?: never } | { error: NextResponse; session?: never; pending?: never }
> {
  const { session, pending } = await getSession();
  if (!session) return { error: unauthorized() };
  return { session, pending };
}

export async function requireAdmin(): Promise<
  { session: SessionContext; pending: PendingCookie[]; error?: never } | { error: NextResponse; session?: never; pending?: never }
> {
  const { session, pending } = await getSession();
  if (!session) return { error: unauthorized() };
  if (session.role !== "admin") return { error: forbidden() };
  return { session, pending };
}

/** Attach queued auth cookies to an outgoing JSON response. */
export function withCookies<T extends NextResponse>(response: T, pending: PendingCookie[]): T {
  return attachCookies(response, pending);
}

export async function logAudit(actor: { name: string; email: string }, action: string, details: string): Promise<void> {
  try {
    const admin = createAdminSupabase();
    await admin.from("audit_logs").insert({
      actor_name: actor.name,
      actor_email: actor.email,
      action,
      details,
    });
  } catch (err) {
    console.error("audit log failed", err);
  }
}

/** Full team with denormalised members (matches legacy Team shape). */
export async function loadTeam(teamId: string): Promise<Team | null> {
  const admin = createAdminSupabase();
  const { data: teamRow } = await admin.from("teams").select("*").eq("id", teamId).maybeSingle<TeamRow>();
  if (!teamRow) return null;
  return loadTeamFromRow(teamRow);
}

export async function loadTeamFromRow(teamRow: TeamRow): Promise<Team> {
  const admin = createAdminSupabase();
  const { data: memberRows } = await admin
    .from("team_members")
    .select("user_id, team_id, role, joined_at, profiles(name, email, institution, department)")
    .eq("team_id", teamRow.id);

  const members: TeamMemberRow[] = (memberRows || []).map((m: any) => ({
    user_id: m.user_id,
    team_id: m.team_id,
    role: m.role,
    joined_at: m.joined_at,
    name: m.profiles?.name,
    email: m.profiles?.email,
    institution: m.profiles?.institution,
    department: m.profiles?.department,
  }));

  return mapTeam(teamRow, members);
}

export async function getSettings(): Promise<EventSettings> {
  const admin = createAdminSupabase();
  const { data } = await admin.from("event_settings").select("*").eq("id", 1).maybeSingle<SettingsRow>();
  if (!data) throw new Error("Event settings row missing — run supabase/schema.sql + seed.sql");
  return mapSettings(data);
}

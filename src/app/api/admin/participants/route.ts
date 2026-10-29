import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, withCookies } from "@/lib/auth";
import { ProfileRow, TeamRow } from "@/lib/supabase/mappers";

export async function GET() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") {
    return withCookies(forbidden(), pending);
  }

  const admin = createAdminSupabase();
  const [{ data: profiles }, { data: teams }] = await Promise.all([
    admin.from("profiles").select("*"),
    admin.from("teams").select("id, name, status"),
  ]);
  const teamMap = new Map((teams || []).map((t: any) => [t.id, t]));

  const participants = (profiles || []).map((u: any) => {
    const team = u.team_id ? teamMap.get(u.team_id) : null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      institution: u.institution,
      department: u.department,
      yearOfStudy: u.year_of_study,
      role: u.role === "admin" ? "admin" : u.role, // effective role is computed client-side when needed
      avatar: u.avatar_url,
      provider: u.provider || "email",
      teamId: u.team_id,
      createdAt: u.created_at,
      teamName: team?.name || null,
      teamStatus: team?.status || "no_team",
    };
  });

  return withCookies(NextResponse.json({ participants }), pending);
}

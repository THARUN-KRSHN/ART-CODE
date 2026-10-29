import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, loadTeam, withCookies } from "@/lib/auth";
import { mapNotification, NotificationRow } from "@/lib/supabase/mappers";

export async function GET() {
  const { session, pending } = await getSession();
  const admin = createAdminSupabase();
  const userId = session?.userId || null;

  const { data: rows } = await admin
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  let teamStatus: "complete" | "incomplete" | null = null;
  let hasSubmitted = false;
  let userTeamId: string | null = null;

  if (session?.profile.team_id) {
    const team = await loadTeam(session.profile.team_id);
    teamStatus = team?.status || null;
    userTeamId = team?.id || null;
    if (team) {
      const { data: sub } = await admin
        .from("submissions")
        .select("id, is_locked, status")
        .eq("team_id", team.id)
        .maybeSingle();
      hasSubmitted = Boolean(sub && (sub.is_locked || sub.status === "submitted"));
    }
  }

  // Get read flags for this user
  let readSet = new Set<string>();
  if (userId) {
    const { data: reads } = await admin
      .from("notification_reads")
      .select("notification_id")
      .eq("user_id", userId);
    readSet = new Set((reads || []).map((r: any) => r.notification_id));
  }

  const filtered = (rows || []).filter((n: any) => {
    switch (n.target_audience as string) {
      case "all":
        return true;
      case "complete_teams":
        return teamStatus === "complete";
      case "incomplete_teams":
        return !teamStatus || teamStatus === "incomplete";
      case "not_submitted":
        return Boolean(teamStatus) && !hasSubmitted;
      case "specific_team":
        return userTeamId && n.target_team_id === userTeamId;
      default:
        return false;
    }
  });

  const notifications = filtered.map((row: any) =>
    mapNotification(row as NotificationRow, userId && readSet.has(row.id) ? [userId] : [])
  );

  return withCookies(NextResponse.json({ notifications, activeUserId: userId }), pending);
}

// POST: Mark notification as read
export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
    }

    const { notificationId, markAll } = await req.json();
    const admin = createAdminSupabase();

    if (markAll) {
      const { data } = await admin
        .from("notifications")
        .select("id")
        .order("created_at", { ascending: false });
      const rows = (data || []).map((n: any) => ({ notification_id: n.id, user_id: session.userId }));
      if (rows.length > 0) {
        await admin.from("notification_reads").upsert(rows, { onConflict: "notification_id,user_id" });
      }
    } else if (notificationId) {
      await admin
        .from("notification_reads")
        .upsert({ notification_id: String(notificationId), user_id: session.userId }, {
          onConflict: "notification_id,user_id",
        });
    }

    return withCookies(NextResponse.json({ success: true }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, logAudit, withCookies } from "@/lib/auth";
import { mapNotification, NotificationRow } from "@/lib/supabase/mappers";

export async function GET() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") {
    return withCookies(forbidden(), pending);
  }

  const admin = createAdminSupabase();
  const { data } = await admin.from("notifications").select("*").order("created_at", { ascending: false });
  const notifications = (data || []).map((n) => mapNotification(n as NotificationRow, []));
  return withCookies(NextResponse.json({ notifications }), pending);
}

export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session || session.role !== "admin") {
      return withCookies(forbidden(), pending);
    }

    const { title, message, priority, targetAudience, targetTeamId } = await req.json();

    if (!title || !message) {
      return withCookies(NextResponse.json({ error: "Title and message are required." }, { status: 400 }), pending);
    }

    const admin = createAdminSupabase();
    const insert = {
      title: String(title).trim(),
      message: String(message).trim(),
      priority: (priority as string) || "normal",
      target_audience: (targetAudience as string) || "all",
      target_team_id: targetTeamId || null,
    };
    const { data, error } = await admin.from("notifications").insert(insert).select("*").single<NotificationRow>();
    if (error || !data) {
      return withCookies(NextResponse.json({ error: error?.message || "Could not publish announcement." }, { status: 400 }), pending);
    }

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "ANNOUNCEMENT_PUBLISHED",
      `Published "${data.title}" to target: ${data.target_audience}`
    );

    return withCookies(NextResponse.json({ success: true, notification: mapNotification(data, []) }), pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

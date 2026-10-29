import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";
import { NotificationItem } from "@/types";

export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser || activeUser.role !== "admin") {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const data = loadData();
  return NextResponse.json({ notifications: data.notifications });
}

export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser || activeUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const { title, message, priority, targetAudience, targetTeamId } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    const data = loadData();
    const newNotif: NotificationItem = {
      id: `notif-${Date.now().toString(36)}`,
      title: title.trim(),
      message: message.trim(),
      priority: priority || "normal",
      targetAudience: targetAudience || "all",
      targetTeamId: targetTeamId || undefined,
      createdAt: new Date().toISOString(),
      readBy: [],
    };

    data.notifications.unshift(newNotif);
    saveData(data);

    addAuditLog(
      activeUser.name,
      activeUser.email,
      "ANNOUNCEMENT_PUBLISHED",
      `Published "${newNotif.title}" to target: ${newNotif.targetAudience}`
    );

    return NextResponse.json({ success: true, notification: newNotif });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


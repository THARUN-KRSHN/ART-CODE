import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, getNotificationsForUser, loadData, saveData } from "@/lib/store";

export async function GET() {
  const activeUser = getActiveUser();
  const notifications = getNotificationsForUser(activeUser?.id || "");
  return NextResponse.json({
    notifications,
    activeUserId: activeUser?.id || null,
  });
}

// POST: Mark notification as read
export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId, markAll } = await req.json();
    const data = loadData();

    if (markAll) {
      data.notifications.forEach((n) => {
        if (!n.readBy.includes(activeUser.id)) {
          n.readBy.push(activeUser.id);
        }
      });
    } else if (notificationId) {
      const notif = data.notifications.find((n) => n.id === notificationId);
      if (notif && !notif.readBy.includes(activeUser.id)) {
        notif.readBy.push(activeUser.id);
      }
    }

    saveData(data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { loadData, saveData, setActiveUser, addAuditLog } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const data = loadData();

    if (!userId) {
      // Set to public visitor
      data.activeUserId = "";
      saveData(data);
      return NextResponse.json({ success: true, user: null });
    }

    const user = setActiveUser(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    addAuditLog(user.name, user.email, "USER_SESSION_SWITCHED", `Switched active session to ${user.name} (${user.role})`);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


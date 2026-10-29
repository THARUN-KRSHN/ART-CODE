import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";

export async function GET() {
  const data = loadData();
  return NextResponse.json({ settings: data.settings });
}

export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser || activeUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const body = await req.json();
    const data = loadData();

    data.settings = {
      ...data.settings,
      ...body,
    };

    saveData(data);

    addAuditLog(
      activeUser.name,
      activeUser.email,
      "EVENT_SETTINGS_UPDATED",
      "Updated event deadlines, prize pool, or event configurations"
    );

    return NextResponse.json({ success: true, settings: data.settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


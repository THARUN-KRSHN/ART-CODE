import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";

export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user: activeUser });
}

export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, institution, department, yearOfStudy } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }

    const data = loadData();
    const user = data.users.find((u) => u.id === activeUser.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.name = name.trim();
    user.phone = phone?.trim() || "";
    user.institution = institution?.trim() || "Christ College of Engineering (Autonomous), Irinjalakuda";
    user.department = department?.trim() || "";
    user.yearOfStudy = yearOfStudy || "";

    saveData(data);

    addAuditLog(user.name, user.email, "PROFILE_UPDATED", `Updated profile details (${user.institution})`);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


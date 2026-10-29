import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";

export async function GET() {
  const activeUser = getActiveUser();
  if (!activeUser || activeUser.role !== "admin") {
    return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
  }

  const data = loadData();
  return NextResponse.json({
    submissions: data.submissions,
    teams: data.teams,
  });
}

// POST: Administrative action to reopen or update a submission
export async function POST(req: NextRequest) {
  try {
    const activeUser = getActiveUser();
    if (!activeUser || activeUser.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Administrator privileges required." }, { status: 403 });
    }

    const { action, submissionId, reason } = await req.json();
    const data = loadData();
    const sub = data.submissions.find((s) => s.id === submissionId);

    if (!sub) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    if (action === "reopen") {
      sub.isLocked = false;
      sub.status = "draft";
      sub.updatedAt = new Date().toISOString();
      saveData(data);

      addAuditLog(
        activeUser.name,
        activeUser.email,
        "ADMIN_REOPEN_SUBMISSION",
        `Admin unlocked submission for team "${sub.teamName}" (Ref: ${sub.referenceId}). Reason: ${reason || "Administrative exception"}`
      );

      return NextResponse.json({ success: true, message: `Submission reopened for ${sub.teamName}. Team leader can now edit.` });
    }

    if (action === "lock") {
      sub.isLocked = true;
      sub.status = "submitted";
      sub.updatedAt = new Date().toISOString();
      saveData(data);

      addAuditLog(
        activeUser.name,
        activeUser.email,
        "ADMIN_LOCK_SUBMISSION",
        `Admin locked submission for team "${sub.teamName}" (Ref: ${sub.referenceId}).`
      );

      return NextResponse.json({ success: true, message: `Submission locked for ${sub.teamName}.` });
    }

    return NextResponse.json({ error: "Unsupported administrative action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import { loadData, saveData, setActiveUser, addAuditLog } from "@/lib/store";
import { UserProfile } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { provider, email, name } = await req.json();
    const data = loadData();

    // Check if existing user
    let user = data.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());

    if (!user) {
      // Register new participant
      const newUserId = `user-${Date.now().toString(36)}`;
      const newUser: UserProfile = {
        id: newUserId,
        name: name || (provider === "github" ? "GitHub Developer" : "Google Participant"),
        email: email || `${newUserId}@domain.edu`,
        institution: "Christ College of Engineering (Autonomous), Irinjalakuda",
        role: "participant",
        provider: provider || "google",
        teamId: null,
        createdAt: new Date().toISOString(),
      };

      data.users.push(newUser);
      data.activeUserId = newUser.id;
      saveData(data);

      addAuditLog(newUser.name, newUser.email, "USER_REGISTERED", `Registered new participant via ${provider}`);
      return NextResponse.json({ success: true, user: newUser, isNew: true });
    } else {
      data.activeUserId = user.id;
      saveData(data);
      addAuditLog(user.name, user.email, "USER_LOGIN", `Participant signed in via ${provider || user.provider}`);
      return NextResponse.json({ success: true, user, isNew: false });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


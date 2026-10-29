import { NextResponse } from "next/server";
import { getActiveUser, loadData, setActiveUser } from "@/lib/store";

export async function GET() {
  const data = loadData();
  const user = getActiveUser();
  return NextResponse.json({
    user,
    allUsers: data.users,
  });
}


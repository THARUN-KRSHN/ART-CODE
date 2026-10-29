import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { forbidden, getSession, withCookies } from "@/lib/auth";
import { mapWinner, WinnerRow } from "@/lib/supabase/mappers";

export async function GET() {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") return withCookies(forbidden(), pending);
  const admin = createAdminSupabase();
  const { data } = await admin.from("winners").select("*").order("rank", { ascending: true });
  return withCookies(NextResponse.json({ winners: (data || []).map((w) => mapWinner(w as WinnerRow)) }), pending);
}

export async function POST(req: NextRequest) {
  const { session, pending } = await getSession();
  if (!session || session.role !== "admin") return withCookies(forbidden(), pending);
  const admin = createAdminSupabase();
  const body = await req.json();
  if (body?.action === "delete") {
    const id = String(body.id || "");
    await admin.from("winners").delete().or(`id.eq.${id},rank.eq.${Number(body.rank)}`);
    return withCookies(NextResponse.json({ success: true }), pending);
  }
  // upsert
  const { id, rank, prizeAmount, teamName, projectTitle, challengeTitle, members, institution, score } = body || {};
  const upsert = {
    id: id || undefined,
    rank: Number(rank),
    prize_amount: String(prizeAmount || ""),
    team_name: String(teamName || ""),
    project_title: String(projectTitle || ""),
    challenge_title: String(challengeTitle || ""),
    members: Array.isArray(members) ? members : [],
    institution: String(institution || ""),
    score: Number(score || 0),
  };
  const { data, error } = await admin.from("winners").upsert(upsert, { onConflict: "rank" }).select("*").single<WinnerRow>();
  if (error || !data) return withCookies(NextResponse.json({ error: error?.message || "Could not save winner" }, { status: 400 }), pending);
  return withCookies(NextResponse.json({ success: true, winner: mapWinner(data) }), pending);
}

import { NextResponse } from "next/server";
import { getChallenges, loadData } from "@/lib/store";

export async function GET() {
  const challenges = getChallenges();
  return NextResponse.json({ challenges });
}


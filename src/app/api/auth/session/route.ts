import { NextResponse } from "next/server";
import { getSession, withCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, pending } = await getSession();
  return withCookies(NextResponse.json({ user: session?.user ?? null }), pending);
}

import { NextResponse } from "next/server";
import { createRouteSupabase, attachCookies } from "@/lib/supabase/server";

export async function POST() {
  try {
    const { supabase, pending } = createRouteSupabase();
    await supabase.auth.signOut();
    const response = NextResponse.json({ success: true });
    return attachCookies(response, pending);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

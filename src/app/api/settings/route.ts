import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { mapSettings, SettingsRow } from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = createAdminSupabase();
  const { data } = await admin.from("event_settings").select("*").eq("id", 1).maybeSingle<SettingsRow>();
  return NextResponse.json({ settings: data ? mapSettings(data) : null });
}

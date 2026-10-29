import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { mapSettings, mapWinner, SettingsRow, WinnerRow } from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = createAdminSupabase();
  const [{ data: sRow }, { data: winners }] = await Promise.all([
    admin.from("event_settings").select("*").eq("id", 1).maybeSingle<SettingsRow>(),
    admin.from("winners").select("*").order("rank", { ascending: true }),
  ]);

  const settings = sRow ? mapSettings(sRow) : null;
  const published = Boolean(settings?.resultsPublished);
  const results = published ? (winners || []).map((w) => mapWinner(w as WinnerRow)) : [];
  return NextResponse.json({ settings, resultsPublished: published, winners: results });
}

import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { mapSettings, SettingsRow } from "@/lib/supabase/mappers";
import { ScheduleISO } from "@/lib/event-schedule";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = createAdminSupabase();
  const { data } = await admin.from("event_settings").select("*").eq("id", 1).maybeSingle<SettingsRow>();
  const base = mapSettings(data || {} as SettingsRow);

  return NextResponse.json({
    settings: {
      ...base,
      registrationOpens: ScheduleISO.registrationOpens,
      submissionOpens: ScheduleISO.submissionOpens,
      submissionDeadline: ScheduleISO.submissionDeadline,
      winnerAnnouncement: ScheduleISO.winnerAnnouncement,
    },
  });
}

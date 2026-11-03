import { NextResponse } from "next/server";
import { createAdminSupabase, isSupabaseConfigured } from "@/lib/supabase/admin";
import { mapSettings, SettingsRow } from "@/lib/supabase/mappers";
import { ScheduleISO } from "@/lib/event-schedule";
import { MOCK_EVENT_SETTINGS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        settings: {
          ...MOCK_EVENT_SETTINGS,
          registrationOpens: ScheduleISO.registrationOpens,
          submissionOpens: ScheduleISO.submissionOpens,
          submissionDeadline: ScheduleISO.submissionDeadline,
          top8Announcement: ScheduleISO.top8Announcement,
          presentationDay: ScheduleISO.presentationDay,
          winnerAnnouncement: ScheduleISO.winnerAnnouncement,
        },
      });
    }

    const admin = createAdminSupabase();
    const { data } = await admin.from("event_settings").select("*").eq("id", 1).maybeSingle<SettingsRow>();
    const base = mapSettings(data || ({} as SettingsRow));

    return NextResponse.json({
      settings: {
        ...base,
        registrationOpens: ScheduleISO.registrationOpens,
        submissionOpens: ScheduleISO.submissionOpens,
        submissionDeadline: ScheduleISO.submissionDeadline,
        top8Announcement: ScheduleISO.top8Announcement,
        presentationDay: ScheduleISO.presentationDay,
        winnerAnnouncement: ScheduleISO.winnerAnnouncement,
      },
    });
  } catch {
    return NextResponse.json({
      settings: {
        ...MOCK_EVENT_SETTINGS,
        registrationOpens: ScheduleISO.registrationOpens,
        submissionOpens: ScheduleISO.submissionOpens,
        submissionDeadline: ScheduleISO.submissionDeadline,
        top8Announcement: ScheduleISO.top8Announcement,
        presentationDay: ScheduleISO.presentationDay,
        winnerAnnouncement: ScheduleISO.winnerAnnouncement,
      },
    });
  }
}

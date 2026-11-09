import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, logAudit, withCookies } from "@/lib/auth";
import { FEEDBACK_SET_VERSION, validateFeedbackAnswers } from "@/lib/feedback-questions";

function friendlyFeedbackError(message: string) {
  return /event_feedback|does not exist|schema cache/i.test(message)
    ? "The feedback form is not active yet. Please contact the organisers."
    : message;
}

interface FeedbackRow {
  id: string;
  user_id: string;
  team_id: string | null;
  answers: Record<string, string | number>;
  question_set_version: string;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  const { session, pending } = await getSession();
  if (!session) {
    return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
  }

  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("event_feedback")
      .select("*")
      .eq("user_id", session.userId)
      .maybeSingle<FeedbackRow>();

    if (error) {
      return withCookies(
        NextResponse.json({ error: friendlyFeedbackError(error.message), submitted: false }),
        pending
      );
    }

    return withCookies(
      NextResponse.json({
        submitted: Boolean(data),
        answers: data?.answers || {},
        submittedAt: data?.updated_at || data?.created_at || null,
        questionSetVersion: data?.question_set_version || null,
      }),
      pending
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message, submitted: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
    }

    const body = await req.json();
    const result = validateFeedbackAnswers(body?.answers);
    if (!result.ok) {
      return withCookies(NextResponse.json({ error: result.error }, { status: 400 }), pending);
    }

    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("event_feedback")
      .upsert(
        {
          user_id: session.userId,
          team_id: session.profile.team_id || null,
          answers: result.answers,
          question_set_version: FEEDBACK_SET_VERSION,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("*")
      .single<FeedbackRow>();

    if (error) {
      return withCookies(
        NextResponse.json({ error: friendlyFeedbackError(error.message) }, { status: 500 }),
        pending
      );
    }

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "FEEDBACK_SUBMITTED",
      `Participant submitted event feedback (${Object.keys(result.answers).length} answers)`
    );

    return withCookies(
      NextResponse.json({ success: true, submitted: true, submittedAt: data.updated_at }),
      pending
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

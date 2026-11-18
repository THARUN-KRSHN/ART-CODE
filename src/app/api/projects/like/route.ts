import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, withCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

function likesUnavailable(message: string) {
  return /project_likes|does not exist|schema cache/i.test(message);
}

function likerIdFrom(session: { userId: string } | null, req: NextRequest): string {
  if (session) return `user:${session.userId}`;
  const guest = req.headers.get("x-visitor-id")?.trim();
  return `guest:${guest || "anonymous"}`;
}

export async function POST(req: NextRequest) {
  const { session, pending } = await getSession();

  let submissionId = "";
  try {
    const body = await req.json();
    submissionId = String(body?.submissionId || "");
  } catch {
    return withCookies(NextResponse.json({ error: "Invalid request" }, { status: 400 }), pending);
  }

  if (!submissionId) {
    return withCookies(NextResponse.json({ error: "submissionId is required" }, { status: 400 }), pending);
  }

  try {
    const admin = createAdminSupabase();
    const likerId = likerIdFrom(session, req);

    const { data: existing, error: findErr } = await admin
      .from("project_likes")
      .select("submission_id")
      .eq("submission_id", submissionId)
      .eq("liker_id", likerId)
      .maybeSingle();

    if (findErr) {
      if (likesUnavailable(findErr.message)) {
        return withCookies(
          NextResponse.json({ error: "Likes are not active yet." }, { status: 503 }),
          pending
        );
      }
      return withCookies(NextResponse.json({ error: findErr.message }, { status: 400 }), pending);
    }

    let liked: boolean;
    if (existing) {
      const { error: delErr } = await admin
        .from("project_likes")
        .delete()
        .eq("submission_id", submissionId)
        .eq("liker_id", likerId);
      if (delErr) {
        return withCookies(NextResponse.json({ error: delErr.message }, { status: 400 }), pending);
      }
      liked = false;
    } else {
      const { error: insErr } = await admin.from("project_likes").insert({
        submission_id: submissionId,
        liker_id: likerId,
      });
      if (insErr) {
        if (likesUnavailable(insErr.message)) {
          return withCookies(
            NextResponse.json({ error: "Likes are not active yet." }, { status: 503 }),
            pending
          );
        }
        return withCookies(NextResponse.json({ error: insErr.message }, { status: 400 }), pending);
      }
      liked = true;
    }

    const { count } = await admin
      .from("project_likes")
      .select("submission_id", { count: "exact", head: true })
      .eq("submission_id", submissionId);

    return withCookies(NextResponse.json({ liked, likeCount: count ?? 0 }), pending);
  } catch {
    return withCookies(
      NextResponse.json({ error: "Could not update like" }, { status: 500 }),
      pending
    );
  }
}

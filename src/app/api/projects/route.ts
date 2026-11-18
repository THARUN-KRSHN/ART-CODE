import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase, isSupabaseConfigured } from "@/lib/supabase/admin";
import { mapSubmission, SubmissionRow } from "@/lib/supabase/mappers";
import { getSession } from "@/lib/auth";
import { ShowcaseProject } from "@/types";

export const dynamic = "force-dynamic";

interface ShowcaseRow extends SubmissionRow {
  teams?: {
    name: string;
    team_members?: { profiles: { name: string } | null }[] | null;
  } | null;
  problem_statements?: {
    title: string;
    category: string;
    code: string;
    slug: string;
  } | null;
}

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ projects: [] });
    }

    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from("submissions")
      .select(
        "*, teams(name, team_members(profiles(name))), problem_statements(title, category, code, slug)"
      )
      .in("status", ["submitted", "under_evaluation", "evaluated"])
      .order("submitted_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Like counts (public) + whether this viewer has liked (best effort)
    const { session } = await getSession();
    const guestId = req.headers.get("x-visitor-id")?.trim();
    const likerId = session ? `user:${session.userId}` : guestId ? `guest:${guestId}` : null;

    const ids = (data || []).map((r) => (r as { id: string }).id);
    let likeCounts: Record<string, number> = {};
    let likedIds = new Set<string>();

    if (ids.length > 0) {
      const { data: likeRows } = await admin
        .from("project_likes")
        .select("submission_id, liker_id")
        .in("submission_id", ids);

      for (const row of likeRows || []) {
        const sid = row.submission_id as string;
        likeCounts[sid] = (likeCounts[sid] || 0) + 1;
        if (likerId && row.liker_id === likerId) likedIds.add(sid);
      }
    }

    const projects: ShowcaseProject[] = (data || []).map((raw) => {
      const row = raw as unknown as ShowcaseRow;
      const sub = mapSubmission(row);
      const members = (row.teams?.team_members || [])
        .map((m) => m?.profiles?.name || "")
        .filter(Boolean);

      return {
        id: sub.id,
        teamName: sub.teamName || row.teams?.name || "Unnamed Team",
        members,
        challengeId: sub.challengeId,
        challengeTitle: sub.challengeTitle || row.problem_statements?.title || "",
        challengeCategory: row.problem_statements?.category || "",
        challengeCode: row.problem_statements?.code || "",
        challengeSlug: row.problem_statements?.slug || "",
        projectTitle: sub.projectTitle,
        shortDescription: sub.shortDescription,
        proposedSolution: sub.proposedSolution,
        keyFeatures: sub.keyFeatures,
        techStack: sub.techStack,
        innovationAndImpact: sub.innovationAndImpact,
        githubUrl: sub.githubUrl,
        liveUrl: sub.liveUrl,
        submittedAt: sub.submittedAt,
        likeCount: likeCounts[sub.id] || 0,
        liked: likedIds.has(sub.id),
      };
    });

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { getSession, getSettings, loadTeam, logAudit, withCookies } from "@/lib/auth";
import { mapSubmission, ProblemRow, SubmissionRow } from "@/lib/supabase/mappers";
import { z } from "zod";

const submissionSchema = z.object({
  projectTitle: z.string().min(5, "Project title must be at least 5 characters long"),
  challengeId: z.string().min(1, "Please select a challenge"),
  shortDescription: z.string().min(20, "Short description must be at least 20 characters"),
  problemDescription: z.string().min(40, "Problem description must be at least 40 characters"),
  proposedSolution: z.string().min(40, "Proposed solution must be at least 40 characters"),
  techStack: z.array(z.string()).min(1, "At least one technology must be listed"),
  innovationAndImpact: z.string().min(30, "Please describe the cultural & technical innovation"),
  githubUrl: z.string().url("Please provide a valid GitHub repository URL").regex(/github\.com/, "Must be a valid GitHub link"),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  googleDriveUrl: z.string().url("Please provide a valid Google Drive folder link").regex(/drive\.google\.com/, "Must be a Google Drive link"),
  additionalComments: z.string().optional(),
  acknowledged: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge the originality and final submission declaration" }),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const { session, pending } = await getSession();
    if (!session) {
      return withCookies(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), pending);
    }

    if (!session.profile.team_id) {
      return withCookies(NextResponse.json({ error: "You must be in a team to submit." }, { status: 400 }), pending);
    }

    const admin = createAdminSupabase();
    const team = await loadTeam(session.profile.team_id);
    if (!team) {
      return withCookies(NextResponse.json({ error: "Team not found." }, { status: 404 }), pending);
    }

    // Role verification: Only Leader can finalize
    if (team.leaderId !== session.userId) {
      return withCookies(
        NextResponse.json(
          { error: "Only the designated Team Leader can perform the final project submission." },
          { status: 403 }
        ),
        pending
      );
    }

    // Eligibility verification: Team MUST have exactly 2 members
    if (team.members.length < 2 || team.status !== "complete") {
      return withCookies(
        NextResponse.json(
          {
            error: "Team Incomplete! ART//CODE 2026 rules strictly require exactly 2 members per team before submission.",
          },
          { status: 400 }
        ),
        pending
      );
    }

    // Deadline & Submission Window Verification
    const now = new Date();
    const settings = await getSettings();
    const opens = new Date(settings.submissionOpens);
    const deadline = new Date(settings.submissionDeadline);
    if (now < opens) {
      return withCookies(
        NextResponse.json(
          { error: `Submission window opens on ${opens.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}` },
          { status: 400 }
        ),
        pending
      );
    }
    if (now > deadline) {
      return withCookies(
        NextResponse.json(
          { error: `Submission window closed. The deadline of ${deadline.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} has passed.` },
          { status: 400 }
        ),
        pending
      );
    }

    // Validate body payload
    const body = await req.json();
    const parseResult = submissionSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMap: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        const path = err.path.join(".");
        errorMap[path] = err.message;
      });
      return NextResponse.json(
        { error: "Validation failed. Please correct the highlighted errors.", fieldErrors: errorMap },
        { status: 422 }
      );
    }

    const validData = parseResult.data;

    const { data: existing } = await admin
      .from("submissions")
      .select("*")
      .eq("team_id", team.id)
      .maybeSingle<SubmissionRow>();

    if (existing && existing.is_locked) {
      return withCookies(NextResponse.json({ error: "This project has already been finalized and locked." }, { status: 400 }), pending);
    }

    const refCode = existing?.reference_id || `AC26-SUB-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionTimestamp = new Date().toISOString();

    // Resolve challenge title
    let challengeTitle = "";
    const { data: prob } = await admin
      .from("problem_statements")
      .select("title")
      .eq("id", validData.challengeId)
      .maybeSingle<Pick<ProblemRow, "title">>();
    challengeTitle = prob?.title || "Challenge Statement";

    const upsert = {
      id: existing?.id,
      team_id: team.id,
      challenge_id: validData.challengeId,
      project_title: validData.projectTitle,
      short_description: validData.shortDescription,
      problem_description: validData.problemDescription,
      proposed_solution: validData.proposedSolution,
      key_features: Array.isArray(body.keyFeatures) && body.keyFeatures.length > 0 ? body.keyFeatures : [
        "Working prototype",
        "Interactive UI",
      ],
      tech_stack: validData.techStack,
      innovation_and_impact: validData.innovationAndImpact,
      github_url: validData.githubUrl,
      live_url: validData.liveUrl || null,
      google_drive_url: validData.googleDriveUrl,
      additional_comments: validData.additionalComments || null,
      status: "submitted",
      reference_id: refCode,
      acknowledged: true,
      submitted_at: submissionTimestamp,
      submitted_by: session.userId,
      is_locked: true,
      updated_at: submissionTimestamp,
    } as Partial<SubmissionRow>;

    const { data: saved, error } = await admin
      .from("submissions")
      .upsert(upsert, { onConflict: "team_id" })
      .select("*")
      .maybeSingle<SubmissionRow>();

    if (error || !saved) {
      return withCookies(NextResponse.json({ error: error?.message || "Could not finalize submission" }, { status: 400 }), pending);
    }

    const submission = mapSubmission(saved, team.name, challengeTitle);

    await logAudit(
      { name: session.user.name, email: session.user.email },
      "SUBMISSION_FINALIZED",
      `Finalized submission ${refCode} for "${team.name}" (Project: ${submission.projectTitle})`
    );

    return withCookies(
      NextResponse.json({ success: true, submission, message: "Your project has been officially submitted and locked." }),
      pending
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

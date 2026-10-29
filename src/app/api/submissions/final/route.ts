import { NextRequest, NextResponse } from "next/server";
import { getActiveUser, loadData, saveData, addAuditLog } from "@/lib/store";
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
    const activeUser = getActiveUser();
    if (!activeUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!activeUser.teamId) {
      return NextResponse.json({ error: "You must be in a team to submit." }, { status: 400 });
    }

    const data = loadData();
    const team = data.teams.find((t) => t.id === activeUser.teamId);
    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Role verification: Only Leader can finalize
    if (team.leaderId !== activeUser.id) {
      return NextResponse.json(
        { error: "Only the designated Team Leader can perform the final project submission." },
        { status: 403 }
      );
    }

    // Eligibility verification: Team MUST have exactly 2 members
    if (team.members.length < 2 || team.status !== "complete") {
      return NextResponse.json(
        {
          error: "Team Incomplete! ART//CODE 2026 rules strictly require exactly 2 members per team before submission.",
        },
        { status: 400 }
      );
    }

    // Deadline & Submission Window Verification
    const now = new Date();
    const deadline = new Date(data.settings.submissionDeadline);
    if (now > deadline) {
      return NextResponse.json(
        {
          error: "Submission window closed. The deadline of 8 November 2026, 11:59 PM IST has passed.",
        },
        { status: 400 }
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
    const challenge = data.challenges.find((c) => c.id === validData.challengeId);

    const existingIdx = data.submissions.findIndex((s) => s.teamId === team.id);
    const existing = existingIdx >= 0 ? data.submissions[existingIdx] : null;

    if (existing && existing.isLocked) {
      return NextResponse.json(
        { error: "This project has already been finalized and locked." },
        { status: 400 }
      );
    }

    // Generate definitive reference ID e.g. AC26-SUB-7391
    const refCode = existing?.referenceId || `AC26-SUB-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionTimestamp = new Date().toISOString();

    const finalizedSubmission = {
      id: existing ? existing.id : `sub-${Date.now().toString(36)}`,
      teamId: team.id,
      teamName: team.name,
      challengeId: validData.challengeId,
      challengeTitle: challenge?.title || "Challenge Statement",
      projectTitle: validData.projectTitle,
      shortDescription: validData.shortDescription,
      problemDescription: validData.problemDescription,
      proposedSolution: validData.proposedSolution,
      keyFeatures: Array.isArray(body.keyFeatures) && body.keyFeatures.length > 0 ? body.keyFeatures : ["Working prototype", "Interactive UI"],
      techStack: validData.techStack,
      innovationAndImpact: validData.innovationAndImpact,
      githubUrl: validData.githubUrl,
      liveUrl: validData.liveUrl || "",
      googleDriveUrl: validData.googleDriveUrl,
      additionalComments: validData.additionalComments || "",
      status: "submitted" as const,
      referenceId: refCode,
      acknowledged: true,
      submittedAt: submissionTimestamp,
      submittedBy: activeUser.id,
      isLocked: true, // Participant editing is now permanently locked
      updatedAt: submissionTimestamp,
    };

    if (existingIdx >= 0) {
      data.submissions[existingIdx] = finalizedSubmission;
    } else {
      data.submissions.push(finalizedSubmission);
    }

    saveData(data);

    addAuditLog(
      activeUser.name,
      activeUser.email,
      "SUBMISSION_FINALIZED",
      `Finalized submission ${refCode} for "${team.name}" (Project: ${finalizedSubmission.projectTitle})`
    );

    return NextResponse.json({
      success: true,
      submission: finalizedSubmission,
      message: "Your project has been officially submitted and locked.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


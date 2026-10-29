"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserProfile, Team, ProjectSubmission, ProblemStatement } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import {
  FileText,
  Github,
  Video,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save,
} from "lucide-react";

export default function SubmissionPortalPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [challenges, setChallenges] = useState<ProblemStatement[]>([]);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [projectTitle, setProjectTitle] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");
  const [keyFeaturesInput, setKeyFeaturesInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [innovationAndImpact, setInnovationAndImpact] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const teamRes = await fetch("/api/teams");
        if (teamRes.status === 401) {
          router.push("/login");
          return;
        }
        const teamData = await teamRes.json();
        setCurrentUser(teamData.user);
        setTeam(teamData.team);

        const chRes = await fetch("/api/challenges");
        const chData = await chRes.json();
        setChallenges(chData.challenges || []);

        if (teamData.team) {
          const subRes = await fetch("/api/submissions");
          const subData = await subRes.json();
          if (subData.submission) {
            const sub: ProjectSubmission = subData.submission;
            setSubmission(sub);
            setProjectTitle(sub.projectTitle || "");
            setChallengeId(sub.challengeId || teamData.team.selectedChallengeId || "ch-01");
            setShortDescription(sub.shortDescription || "");
            setProblemDescription(sub.problemDescription || "");
            setProposedSolution(sub.proposedSolution || "");
            setKeyFeaturesInput((sub.keyFeatures || []).join(", "));
            setTechStackInput((sub.techStack || []).join(", "));
            setInnovationAndImpact(sub.innovationAndImpact || "");
            setGithubUrl(sub.githubUrl || "");
            setLiveUrl(sub.liveUrl || "");
            setGoogleDriveUrl(sub.googleDriveUrl || "");
            setAdditionalComments(sub.additionalComments || "");
            setAcknowledged(sub.acknowledged || false);

            if (sub.isLocked) {
              router.push("/submission/confirmation");
              return;
            }
          } else if (teamData.team.selectedChallengeId) {
            setChallengeId(teamData.team.selectedChallengeId);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  const isLeader = team && currentUser && team.leaderId === currentUser.id;
  const isTeamComplete = team && team.status === "complete" && team.members.length === 2;

  const handleSaveDraft = async () => {
    if (!isLeader) return;
    setIsSaving(true);
    setFeedbackMsg(null);
    setFieldErrors({});

    const techArray = techStackInput.split(",").map((s) => s.trim()).filter(Boolean);
    const featuresArray = keyFeaturesInput.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle,
          challengeId,
          shortDescription,
          problemDescription,
          proposedSolution,
          keyFeatures: featuresArray,
          techStack: techArray,
          innovationAndImpact,
          githubUrl,
          liveUrl,
          googleDriveUrl,
          additionalComments,
          acknowledged,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmission(data.submission);
        setFeedbackMsg({ type: "success", text: "Draft saved successfully." });
      } else {
        setFeedbackMsg({ type: "error", text: data.error || "Failed to save draft" });
      }
    } catch (e: any) {
      setFeedbackMsg({ type: "error", text: e.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!isLeader) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);
    setFieldErrors({});

    const techArray = techStackInput.split(",").map((s) => s.trim()).filter(Boolean);
    const featuresArray = keyFeaturesInput.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/submissions/final", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle,
          challengeId,
          shortDescription,
          problemDescription,
          proposedSolution,
          keyFeatures: featuresArray,
          techStack: techArray,
          innovationAndImpact,
          githubUrl,
          liveUrl,
          googleDriveUrl,
          additionalComments,
          acknowledged,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/submission/confirmation");
      } else {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
          setCurrentStep(1);
        }
        setFeedbackMsg({ type: "error", text: data.error || "Submission failed" });
      }
    } catch (e: any) {
      setFeedbackMsg({ type: "error", text: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-vermilion border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-darkRed">Loading submission gateway...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-cream py-16 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-paleCream p-8 rounded-card border-2 border-mutedGold text-center space-y-4 shadow-subtle">
          <h2 className="text-xl font-bold text-darkRed">Team Required</h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            You must form or join a two-member team before you can draft or submit projects.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase font-mono shadow-subtle"
          >
            Go to Team Formation
          </Link>
        </div>
      </div>
    );
  }

  if (!isTeamComplete) {
    return (
      <div className="min-h-screen bg-cream py-16 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-paleCream p-8 rounded-card border-2 border-accentGold text-center space-y-5 shadow-poster">
          <div className="w-12 h-12 rounded-full bg-accentGold/20 text-vermilion flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-2xl font-bold text-darkRed font-display">Team Incomplete (1/2 Members)</h2>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            ART//CODE 2026 regulations strictly enforce that project submissions remain locked until your second team member joins.
          </p>
          <div className="p-4 rounded-xl bg-cream border border-mutedGold inline-block text-left text-xs space-y-1">
            <div className="text-darkRed font-mono uppercase text-[10px] font-bold">Your Invite Code:</div>
            <div className="text-lg font-mono font-bold text-darkRed">{team.invitationCode}</div>
          </div>
          <div>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase font-mono shadow-subtle"
            >
              <span>Manage Team & Share Code</span>
              <ArrowRight size={14} className="text-accentGold" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedChallengeObj = challenges.find((c) => c.id === challengeId);

  return (
    <div className="min-h-screen bg-cream text-ink py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold flex items-center gap-1.5">
              <RhombusMotif size={12} color="#A32516" />
              <span>Gateway // ART//CODE 2026</span>
            </span>
            <span className="text-xs font-mono text-darkRed font-bold">
              Team: {team.name}
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-darkRed">
            Project Submission Portal
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            {isLeader
              ? "Draft your project details and verify deliverables. Final locking is irreversible."
              : "Read-only view. Only the designated Team Leader can edit drafts and perform final locking."}
          </p>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-xl border-2 text-xs flex items-center gap-2 font-medium ${
              feedbackMsg.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-status-success"
                : "bg-vermilion/10 border-vermilion/40 text-vermilion"
            }`}
          >
            {feedbackMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* 3-Stage Guided Progress Steps (Section 7 Design Rule) */}
        <div className="grid grid-cols-3 gap-3 p-2 bg-paleCream rounded-xl border-2 border-mutedGold shadow-subtle">
          <button
            onClick={() => setCurrentStep(1)}
            className={`py-2 px-3 rounded-lg text-xs font-bold uppercase font-mono tracking-wider transition-colors ${
              currentStep === 1
                ? "bg-vermilion text-cream shadow-subtle"
                : "text-darkRed hover:bg-cream"
            }`}
          >
            01 Project Details
          </button>
          <button
            onClick={() => setCurrentStep(2)}
            className={`py-2 px-3 rounded-lg text-xs font-bold uppercase font-mono tracking-wider transition-colors ${
              currentStep === 2
                ? "bg-vermilion text-cream shadow-subtle"
                : "text-darkRed hover:bg-cream"
            }`}
          >
            02 Deliverables
          </button>
          <button
            onClick={() => setCurrentStep(3)}
            className={`py-2 px-3 rounded-lg text-xs font-bold uppercase font-mono tracking-wider transition-colors ${
              currentStep === 3
                ? "bg-vermilion text-cream shadow-subtle"
                : "text-darkRed hover:bg-cream"
            }`}
          >
            03 Review & Lock
          </button>
        </div>

        {/* STAGE 1: PROJECT DETAILS */}
        {currentStep === 1 && (
          <div className="bg-paleCream p-8 sm:p-10 rounded-card border-2 border-mutedGold shadow-subtle space-y-6">
            <h2 className="text-xs font-bold text-darkRed uppercase tracking-wider font-mono border-b border-mutedGold pb-3 flex items-center gap-2">
              <RhombusMotif size={12} color="#A32516" />
              <span>Stage 1: Core Project Metadata</span>
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                  Project Title *
                </label>
                <input
                  type="text"
                  disabled={!isLeader}
                  required
                  placeholder="e.g. ChitraPunar: Neural Fresco Inpainting"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                />
                {fieldErrors.projectTitle && (
                  <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.projectTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                  Selected Challenge Track *
                </label>
                <select
                  disabled={!isLeader}
                  value={challengeId}
                  onChange={(e) => setChallengeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                >
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                  Short Abstract * (Min 20 characters)
                </label>
                <input
                  type="text"
                  disabled={!isLeader}
                  required
                  placeholder="Concise overview of your cultural technology innovation"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                />
                {fieldErrors.shortDescription && (
                  <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.shortDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                  Problem Description & Cultural Motivation * (Min 40 characters)
                </label>
                <textarea
                  rows={3}
                  disabled={!isLeader}
                  placeholder="Detail the specific traditional craft, artifact, or performance dilemma you are tackling"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                />
                {fieldErrors.problemDescription && (
                  <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.problemDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                  Proposed Solution & Technical Methodology * (Min 40 characters)
                </label>
                <textarea
                  rows={3}
                  disabled={!isLeader}
                  placeholder="Explain your algorithmic approach, model architecture, or creative implementation"
                  value={proposedSolution}
                  onChange={(e) => setProposedSolution(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                />
                {fieldErrors.proposedSolution && (
                  <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.proposedSolution}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                    Key Features (Comma-separated)
                  </label>
                  <input
                    type="text"
                    disabled={!isLeader}
                    placeholder="e.g. Inpainting pipeline, WebGL shader, Talmana ratios"
                    value={keyFeaturesInput}
                    onChange={(e) => setKeyFeaturesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                    Technology Stack * (Comma-separated)
                  </label>
                  <input
                    type="text"
                    disabled={!isLeader}
                    placeholder="e.g. Next.js, PyTorch, Tailwind CSS, WebGL"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                  />
                  {fieldErrors.techStack && (
                    <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.techStack}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                  Cultural Innovation & Real-World Impact * (Min 30 characters)
                </label>
                <textarea
                  rows={2}
                  disabled={!isLeader}
                  placeholder="How does your project advance cultural heritage or artisan communities?"
                  value={innovationAndImpact}
                  onChange={(e) => setInnovationAndImpact(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                />
                {fieldErrors.innovationAndImpact && (
                  <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.innovationAndImpact}</p>
                )}
              </div>

              {/* Repos and Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Github size={13} className="text-vermilion" />
                    <span>Public GitHub Repo URL *</span>
                  </label>
                  <input
                    type="url"
                    disabled={!isLeader}
                    placeholder="https://github.com/org/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                  />
                  {fieldErrors.githubUrl && (
                    <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.githubUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <ExternalLink size={13} className="text-secondaryRed" />
                    <span>Live Demo URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    disabled={!isLeader}
                    placeholder="https://yourproject.vercel.app"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={13} className="text-vermilion" />
                  <span>Google Drive Folder Link * (Video MP4 & Presentation PDF)</span>
                </label>
                <input
                  type="url"
                  disabled={!isLeader}
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={googleDriveUrl}
                  onChange={(e) => setGoogleDriveUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                />
                <span className="text-[10px] text-ink-muted">
                  Must be configured with "Anyone with the link can view".
                </span>
                {fieldErrors.googleDriveUrl && (
                  <p className="text-[11px] text-vermilion font-bold mt-1">{fieldErrors.googleDriveUrl}</p>
                )}
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-6 border-t border-mutedGold flex items-center justify-between">
              {isLeader && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border-2 border-mutedGold bg-cream hover:bg-paleCream text-darkRed text-xs font-bold uppercase font-mono inline-flex items-center gap-1.5 shadow-subtle"
                >
                  <Save size={13} />
                  <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed inline-flex items-center gap-1.5 ml-auto shadow-subtle"
              >
                <span>Continue to Deliverables</span>
                <ArrowRight size={14} className="text-accentGold" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: DELIVERABLES CHECKLIST */}
        {currentStep === 2 && (
          <div className="bg-paleCream p-8 sm:p-10 rounded-card border-2 border-mutedGold shadow-subtle space-y-6">
            <h2 className="text-xs font-bold text-darkRed uppercase tracking-wider font-mono border-b border-mutedGold pb-3 flex items-center gap-2">
              <RhombusMotif size={12} color="#A32516" />
              <span>Stage 2: Deliverables Verification</span>
            </h2>

            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Before reviewing and locking your final submission, please confirm that your repository and Google Drive meet the formatting criteria documented in the{" "}
                <Link href="/guidelines" target="_blank" className="text-vermilion underline font-bold">
                  Event Guidelines
                </Link>
                .
              </p>

              <div className="divide-y divide-mutedGold/60 text-xs">
                <div className="py-3 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-vermilion mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-darkRed">GitHub Repository README Checklist</div>
                    <div className="text-ink-secondary mt-0.5">
                      Includes overview, architecture, installation commands, license, and team credits.
                    </div>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-vermilion mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-darkRed">Demonstration Video (3–5 min)</div>
                    <div className="text-ink-secondary mt-0.5">
                      Uploaded to Google Drive as an MP4 or public YouTube link, walking through the working software.
                    </div>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-vermilion mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-darkRed">Project Presentation (6–10 Slides)</div>
                    <div className="text-ink-secondary mt-0.5">
                      Exported as a clean PDF covering problem, solution, technology, impact, and future scope.
                    </div>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-vermilion mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-darkRed">Google Drive Permission Check</div>
                    <div className="text-ink-secondary mt-0.5">
                      Drive folder access configured as "Anyone with link can view" to allow the DELTA evaluation committee to access files.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-darkRed mb-1 font-mono uppercase tracking-wider">
                  Additional Comments for Judges (Optional)
                </label>
                <textarea
                  rows={2}
                  disabled={!isLeader}
                  placeholder="Any testing credentials, special hardware requirements, or presentation notes"
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:bg-white focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-mutedGold flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl border border-mutedGold bg-cream hover:bg-paleCream text-darkRed text-xs font-bold uppercase font-mono inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Back to Details</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed inline-flex items-center gap-1.5 shadow-subtle"
              >
                <span>Proceed to Final Review</span>
                <ArrowRight size={14} className="text-accentGold" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: REVIEW & LOCK */}
        {currentStep === 3 && (
          <div className="bg-paleCream p-8 sm:p-10 rounded-card border-2 border-mutedGold shadow-subtle space-y-6">
            <div className="border-b border-mutedGold pb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold text-darkRed uppercase tracking-wider font-mono flex items-center gap-2">
                <RhombusMotif size={12} color="#A32516" />
                <span>Stage 3: Review & Final Submission Locking</span>
              </h2>
              <span className="text-[11px] font-mono text-vermilion font-bold">Permanent Action</span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl border border-mutedGold bg-cream space-y-1.5">
                <div className="text-[10px] font-mono text-darkRed uppercase font-bold">Team Details</div>
                <div className="text-sm font-bold text-ink">{team.name}</div>
                <div className="text-xs text-ink-secondary">
                  Members: {team.members.map((m) => `${m.name} (${m.role})`).join(" • ")}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-mutedGold bg-cream space-y-1.5">
                <div className="text-[10px] font-mono text-darkRed uppercase font-bold">Project Details</div>
                <div className="text-sm font-bold text-darkRed">
                  {projectTitle || <span className="text-vermilion">Missing Project Title</span>}
                </div>
                <div className="text-xs text-ink-secondary">
                  Track: {selectedChallengeObj?.title || challengeId}
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed pt-1">
                  {shortDescription || <span className="text-vermilion">Missing description</span>}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-mutedGold bg-cream space-y-1.5">
                <div className="text-[10px] font-mono text-darkRed uppercase font-bold">Submitted Links</div>
                <div className="text-xs text-ink-secondary space-y-1">
                  <div>GitHub: <span className="font-mono text-ink">{githubUrl || "Not specified"}</span></div>
                  <div>Live Demo: <span className="font-mono text-ink">{liveUrl || "Not specified"}</span></div>
                  <div>Drive Folder: <span className="font-mono text-ink">{googleDriveUrl || "Not specified"}</span></div>
                </div>
              </div>

              {/* Mandatory Acknowledgement */}
              <div className="p-5 rounded-xl border-2 border-vermilion bg-cream space-y-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={!isLeader}
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-vermilion focus:ring-vermilion border-mutedGold"
                  />
                  <div className="text-xs text-darkRed leading-relaxed font-medium">
                    <strong>Official Declaration:</strong> I certify on behalf of team{" "}
                    <strong>{team.name}</strong> that all code, models, and presentation deliverables are our original work developed for ART//CODE 2026. I acknowledge that upon selecting "Finalize & Lock Submission", all editing will be permanently locked and submitted to the evaluation rubric.
                  </div>
                </label>
                {fieldErrors.acknowledged && (
                  <p className="text-[11px] text-vermilion font-bold pl-7">{fieldErrors.acknowledged}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-mutedGold flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl border border-mutedGold bg-cream hover:bg-paleCream text-darkRed text-xs font-bold uppercase font-mono inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Back to Deliverables</span>
              </button>

              {isLeader ? (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting || !acknowledged}
                  className="px-6 py-3 rounded-xl bg-vermilion hover:bg-darkRed text-cream text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-poster disabled:opacity-50"
                >
                  <ShieldCheck size={16} className="text-accentGold" />
                  <span>{isSubmitting ? "Locking & Submitting..." : "Finalize & Lock Submission"}</span>
                </button>
              ) : (
                <span className="text-xs text-darkRed italic font-medium">
                  Only the Team Leader can perform final submission.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

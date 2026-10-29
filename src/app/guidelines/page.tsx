"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FileText,
  Video,
  Github,
  Award,
  ArrowRight,
} from "lucide-react";

export default function GuidelinesPage() {
  const [activeSection, setActiveSection] = useState<string>("sec-eligibility");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const sections = [
    { id: "sec-eligibility", label: "1. Eligibility & Scope" },
    { id: "sec-teams", label: "2. Team Formation (2 Members)" },
    { id: "sec-development", label: "3. Project Development" },
    { id: "sec-ethics", label: "4. Originality & Ethics" },
    { id: "sec-deliverables", label: "5. Submission Requirements" },
    { id: "sec-github", label: "6. GitHub Repository Structure" },
    { id: "sec-presentation", label: "7. Presentation Requirements" },
    { id: "sec-video", label: "8. Demo Video Requirements" },
    { id: "sec-rubric", label: "9. Judging & Scoring Rubric" },
    { id: "sec-prizes", label: "10. Prizes & Citations" },
    { id: "sec-disqualification", label: "11. Disqualification Conditions" },
    { id: "sec-contact", label: "12. Contact & Organisers" },
  ];

  return (
    <div className="min-h-screen bg-ivory py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-12">
          <div className="text-xs font-mono tracking-widest text-terracotta uppercase">
            Official Regulatory Document // ART//CODE 2026
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-ink leading-tight">
            Guidelines, Rules & Evaluation Rubric
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            The single source of truth for participation eligibility, repository templates, presentation structure, and grading rubrics.
          </p>
        </div>

        {/* Layout with sticky sidebar on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Navigation Index */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-5 rounded-card border border-border bg-white shadow-subtle space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-muted">
                Document Sections
              </span>
              <nav className="flex flex-col space-y-1 pt-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors text-left font-medium ${
                      activeSection === s.id
                        ? "bg-ivory-200 text-terracotta font-semibold"
                        : "text-ink-secondary hover:bg-ivory-100 hover:text-ink"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick action card */}
            <div className="p-5 rounded-card border border-border bg-ivory-50 text-xs text-ink-secondary space-y-3">
              <div className="font-bold text-ink">Ready to Register?</div>
              <p>Form your team of two and begin drafting your solution.</p>
              <Link
                href="/register"
                className="w-full text-center block py-2 rounded-lg bg-ink text-white font-semibold hover:bg-ink-pure transition-colors"
              >
                Register Team
              </Link>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section 1: Eligibility */}
            <section id="sec-eligibility" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-ink font-sans">1. Eligibility & Scope</h2>
              <ul className="space-y-2 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                <li>• Open to active undergraduate and postgraduate students from recognized colleges and universities.</li>
                <li>• Cross-departmental collaborations (e.g. Data Science with Computer Science, Design, or Electronics) are encouraged.</li>
                <li>• Every participant must maintain a single registered profile on the ART//CODE platform.</li>
              </ul>
            </section>

            {/* Section 2: Team Formation */}
            <section id="sec-teams" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink font-sans">2. Team Formation (Strict 2-Member Limit)</h2>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-terracotta-50 text-terracotta border border-terracotta-200">
                  Strict Rule
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                To guarantee equal distribution of effort and promote focused peer pair-programming, teams must consist of <strong>exactly two members</strong>.
              </p>
              <div className="p-4 rounded-xl border border-border bg-ivory-50 text-xs text-ink space-y-2">
                <div className="font-semibold text-terracotta">Team Roles & Permissions:</div>
                <ul className="space-y-1.5 text-ink-secondary">
                  <li>• <strong>Team Leader:</strong> Creates the team, shares the 8-character invitation code, selects the problem statement, edits drafts, and submits final project locking.</li>
                  <li>• <strong>Teammate:</strong> Joins using the code, reviews the draft in real-time, inspects submission confirmation, and views results.</li>
                  <li>• <strong>Locking Gateway:</strong> Project submission remains disabled if the team has only 1 active member.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Project Development */}
            <section id="sec-development" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-ink font-sans">3. Project Development Window</h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                All development must occur during the official hackathon window (30 October 2026 – 8 November 2026).
              </p>
              <div className="p-4 rounded-xl border border-terracotta/40 bg-terracotta-50/50 text-xs text-ink space-y-1">
                <div className="font-bold text-terracotta">Critical Deadline:</div>
                <div>8 November 2026, 11:59 PM IST (Indian Standard Time).</div>
                <div className="text-ink-secondary text-[11px]">Late submissions will not be received by the platform gateway.</div>
              </div>
            </section>

            {/* Section 4: Originality and Ethics */}
            <section id="sec-ethics" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-ink font-sans">4. Originality, Cultural Fidelity & Ethics</h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Participants must respect cultural authenticity. When applying neural models or algorithmic transforms to sacred iconography (e.g. temple murals, classical mudras, or archaic calligraphy), designs must maintain iconometric integrity and avoid offensive caricatures.
              </p>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Open-source libraries and pretrained models are allowed, provided proper attribution is documented in the project README.
              </p>
            </section>

            {/* Section 5: Submission Requirements */}
            <section id="sec-deliverables" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-ink font-sans">5. Required Deliverables</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-ivory-50 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <Github size={16} className="text-terracotta" />
                    <span>1. Public GitHub Repo</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    Source code with structured directory, clear installation instructions, and permissive license.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-ivory-50 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <Video size={16} className="text-indigo" />
                    <span>2. Demo Video (3–5 min)</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    Hosted on Google Drive or YouTube walking through problem, architecture, and live prototype.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-ivory-50 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <FileText size={16} className="text-saffron-600" />
                    <span>3. Presentation (6–10 Slides)</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    PDF presentation deck highlighting problem context, tech stack, innovation, and limitations.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-ivory-50 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <CheckCircle2 size={16} className="text-sage-600" />
                    <span>4. Google Drive Folder</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    Single folder containing presentation PDF, video MP4, and any auxiliary dataset samples.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: GitHub README Structure */}
            <section id="sec-github" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink font-sans">6. GitHub Repository README Structure</h2>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# Project Title\n\n## 1. Project Overview\n\n## 2. Problem Statement\n\n## 3. Key Features\n\n## 4. Technology Stack\n\n## 5. System Architecture\n\n## 6. Installation & Setup Instructions\n\n## 7. Environment Variables\n\n## 8. Usage Instructions\n\n## 9. Demonstration Screenshots\n\n## 10. Team Members\n\n## 11. Limitations & Future Scope\n\n## 12. License & Attribution`,
                      "readme"
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-border bg-ivory-100 hover:bg-ivory-200 text-xs font-medium text-ink flex items-center gap-1.5"
                >
                  {copiedText === "readme" ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
                  <span>{copiedText === "readme" ? "Copied" : "Copy Template"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-ivory-100 text-[11px] font-mono text-ink space-y-1 overflow-x-auto border border-border">
                <div># Project Title</div>
                <div>## 1. Project Overview</div>
                <div>## 2. Problem Statement</div>
                <div>## 3. Key Features</div>
                <div>## 4. Technology Stack</div>
                <div>## 5. System Architecture</div>
                <div>## 6. Installation & Setup Instructions</div>
                <div>## 7. Environment Variables</div>
                <div>## 8. Usage Instructions</div>
                <div>## 9. Demonstration Screenshots</div>
                <div>## 10. Team Members</div>
                <div>## 11. Limitations & Future Scope</div>
                <div>## 12. License & Attribution</div>
              </div>
            </section>

            {/* Section 7 & 8: Presentation and Video */}
            <section id="sec-presentation" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-ink font-sans">7. Presentation Deck & Video Specifications</h2>
              <div className="space-y-4 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                <div className="p-4 rounded-xl border border-border bg-ivory-50">
                  <div className="font-bold text-ink mb-1">Slide Deck Structure (6–10 Slides):</div>
                  <ol className="list-decimal list-inside space-y-1 text-ink-secondary text-xs">
                    <li>Title and Team Details</li>
                    <li>Problem Statement & Cultural Background</li>
                    <li>Proposed Algorithmic / Digital Solution</li>
                    <li>Core Technical Architecture & Tech Stack</li>
                    <li>Working Prototype Demonstration Highlights</li>
                    <li>Cultural Innovation, Impact, and Limitations</li>
                    <li>Future Scope and Artisan / Museum Utility</li>
                  </ol>
                </div>

                <div id="sec-video" className="p-4 rounded-xl border border-border bg-ivory-50 scroll-mt-24">
                  <div className="font-bold text-ink mb-1">Demonstration Video (3–5 Minutes):</div>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Introduce the two team members, concisely articulate the problem, and present a live unedited screen recording demonstrating the working prototype.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Evaluation Rubric Table */}
            <section id="sec-rubric" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-6 scroll-mt-24">
              <div className="border-b border-border pb-3">
                <h2 className="text-xl font-bold text-ink font-sans">9. Evaluation Rubric (100 Points)</h2>
                <p className="text-xs text-ink-secondary mt-1">
                  Evaluated independently by the DELTA faculty and peer evaluation committee.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border text-ink font-mono uppercase text-[11px]">
                      <th className="py-3 pr-4">Evaluation Criterion</th>
                      <th className="py-3 px-4">Focus & Assessment Standard</th>
                      <th className="py-3 pl-4 text-right">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-ink-secondary">
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-ink">Innovation and Originality</td>
                      <td className="py-3.5 px-4 text-xs">Uniqueness of the algorithmic approach; avoidance of superficial generic templates.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-terracotta">25</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-ink">Technical Implementation</td>
                      <td className="py-3.5 px-4 text-xs">Robust architecture, functional code, clean GitHub repository, and execution reliability.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-indigo">25</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-ink">Relevance to the Theme</td>
                      <td className="py-3.5 px-4 text-xs">Depth of engagement with art, culture, heritage, folklore, or traditional crafts.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-saffron-600">20</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-ink">User Experience and Design</td>
                      <td className="py-3.5 px-4 text-xs">Clarity of interface, typography, responsiveness, aesthetic taste, and accessibility.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-sage-600">15</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-ink">Potential Impact & Feasibility</td>
                      <td className="py-3.5 px-4 text-xs">Real-world utility for artisans, cultural archivists, museums, or educational trusts.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-ink">15</td>
                    </tr>
                    <tr className="border-t-2 border-border font-bold text-ink">
                      <td className="py-4 pr-4" colSpan={2}>Total Marks</td>
                      <td className="py-4 pl-4 text-right font-mono text-base">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 10: Prizes */}
            <section id="sec-prizes" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-ink font-sans">10. Prizes & Citations</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl border border-terracotta/40 bg-terracotta-50/50">
                  <div className="text-xs font-mono text-terracotta font-bold">1st Place</div>
                  <div className="font-editorial text-2xl font-bold text-ink mt-1">₹1,500</div>
                  <div className="text-[10px] text-ink-muted mt-1">First Merit Certificate</div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-ivory-50">
                  <div className="text-xs font-mono text-ink-muted">2nd Place</div>
                  <div className="font-editorial text-2xl font-bold text-ink mt-1">₹1,000</div>
                  <div className="text-[10px] text-ink-muted mt-1">Silver Certificate</div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-ivory-50">
                  <div className="text-xs font-mono text-ink-muted">3rd Place</div>
                  <div className="font-editorial text-2xl font-bold text-ink mt-1">₹500</div>
                  <div className="text-[10px] text-ink-muted mt-1">Bronze Certificate</div>
                </div>
              </div>
            </section>

            {/* Section 11: Disqualification Conditions */}
            <section id="sec-disqualification" className="p-8 rounded-card border border-status-error/30 bg-red-50/30 shadow-subtle space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2 text-status-error font-bold">
                <ShieldAlert size={18} />
                <h2 className="text-lg font-sans">11. Disqualification Conditions</h2>
              </div>
              <ul className="space-y-2 text-xs text-ink-secondary leading-relaxed">
                <li>• Plagiarism or submitting pre-existing projects completed before the event start.</li>
                <li>• Committing private API keys, secrets, or sensitive institutional credentials to GitHub.</li>
                <li>• Tampering with platform submission locks, falsifying team membership, or multiple accounts.</li>
                <li>• Submissions with inaccessible Google Drive links or missing demonstration deliverables.</li>
              </ul>
            </section>

            {/* Section 12: Contact */}
            <section id="sec-contact" className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-ink font-sans">12. Contact & Grievances</h2>
              <p className="text-xs text-ink-secondary leading-relaxed">
                For administrative assistance, submission queries, or technical clarification, contact the DELTA Organizing Committee:
              </p>
              <div className="text-xs font-mono text-ink">
                Email: <span className="text-terracotta">delta@cce.edu.in</span> • Christ College of Engineering (Autonomous), Irinjalakuda
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}


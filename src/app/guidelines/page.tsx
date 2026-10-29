"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RhombusMotif, CornerFlourish } from "@/components/art/CulturalMotifs";
import {
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Video,
  Github,
  Award,
  ArrowRight,
  ShieldAlert,
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
    <div className="min-h-screen bg-cream text-ink py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3 mb-12">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion uppercase font-bold">
            <RhombusMotif size={14} />
            <span>Official Regulatory Handbook // ART//CODE 2026</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-darkRed leading-tight">
            Guidelines, Rules & Evaluation Rubric
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            The single source of truth for eligibility, pair programming formation, deliverables, and the 100-point judging rubric.
          </p>
        </div>

        {/* Layout with sticky sidebar on desktop (Panel 08 Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Navigation Index */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-5 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-darkRed flex items-center gap-2">
                <RhombusMotif size={12} color="#A32516" />
                <span>Document Sections</span>
              </span>
              <nav className="flex flex-col space-y-1 pt-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors text-left font-semibold ${
                      activeSection === s.id
                        ? "bg-vermilion text-cream shadow-subtle font-bold"
                        : "text-ink-secondary hover:bg-cream hover:text-darkRed"
                    }`}
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick action card */}
            <div className="p-5 rounded-card border-2 border-vermilion bg-cream text-xs text-ink-secondary space-y-3 shadow-subtle">
              <div className="font-bold text-darkRed text-sm">Ready to Register?</div>
              <p>Form your team of two and begin drafting your solution.</p>
              <Link
                href="/register"
                className="w-full text-center block py-2.5 rounded-xl bg-vermilion text-cream font-bold text-xs uppercase tracking-wider hover:bg-darkRed transition-colors shadow-subtle"
              >
                Register Team
              </Link>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 space-y-10 relative">
            {/* Section 1: Eligibility */}
            <section id="sec-eligibility" className="p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-darkRed font-display">1. Eligibility & Scope</h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                <li>• Open to all registered undergraduate and postgraduate students from recognized colleges and universities.</li>
                <li>• Cross-departmental collaborations (e.g. Data Science with Computer Science, Fine Arts, or Electronics) are encouraged.</li>
                <li>• Each participant must maintain a single registered profile on the ART//CODE platform.</li>
              </ul>
            </section>

            {/* Section 2: Team Formation (Panel 08 Highlighted Callout) */}
            <section id="sec-teams" className="p-8 rounded-card border-2 border-vermilion bg-cream shadow-subtle space-y-4 scroll-mt-24 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-darkRed font-display">2. Team Formation (Strict 2-Member Limit)</h2>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-vermilion text-cream shadow-subtle">
                  Strict Rule
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                To guarantee equal distribution of effort and promote focused peer pair-programming, teams must consist of <strong>exactly two members</strong>.
              </p>

              {/* Panel 08 Callout Box */}
              <div className="p-5 rounded-xl border-2 border-accentGold bg-paleCream text-xs text-darkRed space-y-2 font-medium">
                <div className="font-bold uppercase tracking-wider text-vermilion flex items-center gap-2">
                  <RhombusMotif size={14} color="#A32516" />
                  <span>Mandatory Team Rule:</span>
                </div>
                <p className="text-sm font-semibold leading-snug">
                  Each team must consist of exactly two registered members. Both members must be present in the team before the submission process becomes available.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-ink-secondary">
                <div className="font-bold text-darkRed">Roles & Permissions:</div>
                <ul className="space-y-1.5 leading-relaxed">
                  <li>• <strong>Team Leader:</strong> Creates the team, shares the 8-character invitation code, selects the problem statement, edits drafts, and submits final project locking.</li>
                  <li>• <strong>Teammate:</strong> Joins using the code, reviews the draft in real-time, inspects submission confirmation, and views results.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Project Development */}
            <section id="sec-development" className="p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-darkRed font-display">3. Project Development Window</h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                All development must occur during the official hackathon window (30 October 2026 – 8 November 2026).
              </p>
              <div className="p-4 rounded-xl border-2 border-vermilion bg-cream text-xs text-darkRed font-mono space-y-1">
                <div className="font-bold uppercase tracking-wider text-vermilion">Submission Hard Stop:</div>
                <div className="text-sm font-bold">8 November 2026, 11:59 PM IST (Indian Standard Time)</div>
                <div className="text-[11px] text-ink-secondary">Late submissions will not be received by the platform gateway.</div>
              </div>
            </section>

            {/* Section 4: Originality and Ethics */}
            <section id="sec-ethics" className="p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-darkRed font-display">4. Originality, Cultural Fidelity & Ethics</h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Participants must respect cultural authenticity. When applying neural models or algorithmic transforms to sacred iconography (e.g. temple murals, classical mudras, or archaic calligraphy), designs must maintain iconometric integrity and avoid offensive caricatures.
              </p>
            </section>

            {/* Section 5: Submission Requirements */}
            <section id="sec-deliverables" className="p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4 scroll-mt-24">
              <h2 className="text-xl font-bold text-darkRed font-display">5. Required Deliverables</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-mutedGold bg-cream text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-darkRed">
                    <Github size={16} className="text-vermilion" />
                    <span>1. Public GitHub Repo</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    Source code with structured directory, clear installation instructions, and permissive license.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-mutedGold bg-cream text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-darkRed">
                    <Video size={16} className="text-secondaryRed" />
                    <span>2. Demo Video (3–5 min)</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    Hosted on Google Drive or YouTube walking through problem, architecture, and live prototype.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-mutedGold bg-cream text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-darkRed">
                    <FileText size={16} className="text-vermilion" />
                    <span>3. Presentation (6–10 Slides)</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    PDF presentation deck highlighting problem context, tech stack, innovation, and limitations.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-mutedGold bg-cream text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-darkRed">
                    <CheckCircle2 size={16} className="text-vermilion" />
                    <span>4. Google Drive Folder</span>
                  </div>
                  <p className="text-ink-secondary leading-relaxed">
                    Single folder containing presentation PDF, video MP4, and auxiliary assets with public view access.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: GitHub README Structure */}
            <section id="sec-github" className="p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-darkRed font-display">6. GitHub Repository README Structure</h2>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `# Project Title\n\n## 1. Project Overview\n\n## 2. Problem Statement\n\n## 3. Key Features\n\n## 4. Technology Stack\n\n## 5. System Architecture\n\n## 6. Installation & Setup Instructions\n\n## 7. Environment Variables\n\n## 8. Usage Instructions\n\n## 9. Demonstration Screenshots\n\n## 10. Team Members\n\n## 11. Limitations & Future Scope\n\n## 12. License & Attribution`,
                      "readme"
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg border border-mutedGold bg-cream hover:bg-paleCream text-xs font-bold uppercase font-mono text-darkRed flex items-center gap-1.5 shadow-subtle"
                >
                  {copiedText === "readme" ? <Check size={13} className="text-status-success" /> : <Copy size={13} />}
                  <span>{copiedText === "readme" ? "Copied" : "Copy Template"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-cream text-[11px] font-mono text-ink space-y-1 overflow-x-auto border border-mutedGold">
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

            {/* Section 9: Evaluation Rubric Table */}
            <section id="sec-rubric" className="p-8 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-6 scroll-mt-24">
              <div className="border-b-2 border-mutedGold pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-darkRed font-display">9. Evaluation Rubric (100 Points)</h2>
                  <p className="text-xs text-ink-secondary mt-1">
                    Evaluated independently by the DELTA faculty and peer evaluation committee.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-vermilion">100 MARKS TOTAL</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-mutedGold text-darkRed font-mono uppercase text-[11px]">
                      <th className="py-3 pr-4">Evaluation Criterion</th>
                      <th className="py-3 px-4">Focus & Assessment Standard</th>
                      <th className="py-3 pl-4 text-right">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mutedGold/60 text-ink-secondary">
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-darkRed">Innovation and Originality</td>
                      <td className="py-3.5 px-4 text-xs">Uniqueness of the algorithmic approach; creative synthesis.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-vermilion">25</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-darkRed">Technical Implementation</td>
                      <td className="py-3.5 px-4 text-xs">Robust architecture, functional code, and execution reliability.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-darkRed">25</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-darkRed">Relevance to the Theme</td>
                      <td className="py-3.5 px-4 text-xs">Depth of engagement with art, culture, heritage, or folklore.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-vermilion">20</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-darkRed">User Experience and Design</td>
                      <td className="py-3.5 px-4 text-xs">Aesthetic taste, typography, responsiveness, and accessibility.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-secondaryRed">15</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 pr-4 font-bold text-darkRed">Potential Impact & Feasibility</td>
                      <td className="py-3.5 px-4 text-xs">Utility for artisans, cultural archivists, or educational trusts.</td>
                      <td className="py-3.5 pl-4 text-right font-mono font-bold text-ink">15</td>
                    </tr>
                    <tr className="border-t-2 border-darkRed font-bold text-darkRed">
                      <td className="py-4 pr-4" colSpan={2}>Total Marks</td>
                      <td className="py-4 pl-4 text-right font-mono text-base text-vermilion">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 11: Disqualification */}
            <section id="sec-disqualification" className="p-8 rounded-card border-2 border-vermilion bg-paleCream shadow-subtle space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2 text-vermilion font-bold">
                <ShieldAlert size={18} />
                <h2 className="text-lg font-display">11. Disqualification Conditions</h2>
              </div>
              <ul className="space-y-2 text-xs text-ink-secondary leading-relaxed">
                <li>• Plagiarism or submitting pre-existing projects completed before the event start.</li>
                <li>• Committing private API keys, credentials, or sensitive institutional tokens to GitHub.</li>
                <li>• Tampering with platform submission locks or duplicate accounts.</li>
                <li>• Submissions with inaccessible Google Drive links or missing demonstration deliverables.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

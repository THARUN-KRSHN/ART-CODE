import React from "react";
import Link from "next/link";
import { PosterArtwork } from "@/components/art/PosterArtwork";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import { RhombusMotif, CulturalDivider } from "@/components/art/CulturalMotifs";
import { ProblemStatement } from "@/types";
import { headers } from "next/headers";
// Data fetched from real database via API routes (no build-time JSON)
import {
  Calendar,
  Users,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  FileCode,
} from "lucide-react";

export default async function HomePage() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  const base = `${proto}://${host}`;

  const [settingsRes, challengesRes] = await Promise.all([
    fetch(`${base}/api/settings`, { cache: "no-store" }),
    fetch(`${base}/api/challenges`, { cache: "no-store" }),
  ]);
  const { settings } = await settingsRes.json();
  const cj = await challengesRes.json();
  const challenges: ProblemStatement[] = (cj?.challenges || []) as ProblemStatement[];

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
  const timelineMilestones = [
    { date: fmt(settings.registrationOpens), title: "Team Registration Opens", desc: "Participant onboarding and two-member team formation commences", status: "active" },
    { date: fmt(settings.submissionOpens), title: "Project Submission Opens", desc: "Teams can begin drafting problem statements and deliverables", status: "upcoming" },
    { date: fmt(settings.submissionDeadline), title: "Submission Deadline", desc: "11:59 PM IST — Final project locking and confirmation", status: "upcoming", highlight: true },
    { date: fmt(settings.winnerAnnouncement), title: "Winner Announcement", desc: "Official announcement of results and prize citations", status: "upcoming" },
  ];

  const faqs = [
    {
      q: "What is the team size requirement for ART//CODE 2026?",
      a: "Each team must consist of exactly 2 members. Solo participants cannot submit projects, and teams cannot exceed two members. The platform enforces this strictly at the submission gateway.",
    },
    {
      q: "Who is eligible to participate?",
      a: "Students passionate about computer science, data science, creative technology, art history, and digital humanities are welcome. Cross-departmental collaborations are strongly encouraged.",
    },
    {
      q: "What deliverables are required during final submission?",
      a: "Teams must provide: (1) Project title, architecture, and cultural description, (2) A public GitHub repository with comprehensive README, (3) A working prototype or live demo, and (4) A Google Drive folder containing a 3–5 min demonstration video and 6–10 slide presentation.",
    },
    {
      q: "Can we edit our submission after finalizing?",
      a: "You can save drafts freely before the deadline. However, once the Team Leader selects 'Finalize & Lock Submission', the record becomes permanently immutable to ordinary participants.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      {/* 1. HERO SECTION (Panel 04 Layout) */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24 border-b-2 border-mutedGold bg-gradient-to-b from-cream via-paleCream/60 to-cream">
        {/* Subtle traditional Indian pattern texture */}
        <div className="absolute inset-0 bg-cultural-pattern opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paleCream border border-mutedGold text-xs font-mono font-bold tracking-widest text-vermilion uppercase shadow-subtle">
                <span className="text-accentGold">Δ</span>
                <span>DELTA PRESENTS // VIRTUAL HACKATHON</span>
              </div>

              {/* Iconic Display Title from Reference Poster */}
              <div className="space-y-1">
                <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-ink leading-[0.95]">
                  <span className="text-vermilion drop-shadow-sm">ART</span>
                  <span className="text-accentGold font-editorial italic font-normal px-2">//</span>
                  <br />
                  <span className="text-darkRed text-4xl sm:text-6xl font-extrabold mr-3">2026</span>
                  <span className="text-vermilion drop-shadow-sm">CODE</span>
                </h1>
                <p className="font-editorial text-2xl sm:text-3xl text-darkRed italic font-normal pt-2">
                  WHERE CREATIVITY MEETS TECHNOLOGY.
                </p>
              </div>

              <p className="text-sm sm:text-base text-ink-secondary max-w-xl leading-relaxed">
                A virtual hackathon celebrating Indian art, culture, heritage, and creative technology. Reimagining traditional craftsmanship, performing arts, folklore, and sacred geometry through computational intelligence.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="px-6 py-3.5 rounded-xl bg-vermilion text-cream font-bold text-xs uppercase tracking-wider hover:bg-darkRed transition-all shadow-subtle hover:shadow-poster flex items-center gap-2 border border-vermilion-700"
                >
                  <span>Register Now</span>
                  <ArrowRight size={15} className="text-accentGold" />
                </Link>

                <Link
                  href="/challenges"
                  className="px-6 py-3.5 rounded-xl bg-paleCream border-2 border-mutedGold text-ink font-bold text-xs uppercase tracking-wider hover:bg-cream hover:border-vermilion transition-colors shadow-subtle"
                >
                  Explore Challenges
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-4 text-xs font-mono text-darkRed/80">
                <span className="font-bold">CHRIST COLLEGE OF ENGINEERING</span>
                <span>•</span>
                <span>AUTONOMOUS INSTITUTION</span>
              </div>
            </div>

            {/* Right Column: Poster Artwork (Kathakali / Theyyam Performer) */}
            <div className="lg:col-span-5 flex justify-center">
              <PosterArtwork />
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVENT AT A GLANCE (4 Compact Cards) */}
      <section className="py-12 bg-paleCream border-b-2 border-mutedGold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-card border-2 border-mutedGold bg-cream shadow-subtle flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-vermilion/10 text-vermilion flex items-center justify-center mb-3">
                <Sparkles size={20} />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-darkRed font-semibold">Format</div>
              <div className="text-lg font-bold text-ink mt-0.5">Virtual Hackathon</div>
              <div className="text-xs text-ink-secondary mt-1">Remote & asynchronous collaboration</div>
            </div>

            <div className="p-6 rounded-card border-2 border-mutedGold bg-cream shadow-subtle flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-accentGold/20 text-darkRed flex items-center justify-center mb-3">
                <Users size={20} />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-darkRed font-semibold">Team Size</div>
              <div className="text-lg font-bold text-vermilion mt-0.5">Two Members per Team</div>
              <div className="text-xs text-ink-secondary mt-1">Strict pair programming rule</div>
            </div>

            <div className="p-6 rounded-card border-2 border-mutedGold bg-cream shadow-subtle flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-vermilion/10 text-vermilion flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-darkRed font-semibold">Prize Pool</div>
              <div className="text-lg font-bold text-ink mt-0.5">{settings.totalPrizePool} Cash Pool</div>
              <div className="text-xs text-ink-secondary mt-1">Plus participation certificates</div>
            </div>

            <div className="p-6 rounded-card border-2 border-mutedGold bg-cream shadow-subtle flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-accentGold/20 text-darkRed flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-darkRed font-semibold">Event Dates</div>
              <div className="text-lg font-bold text-ink mt-0.5">{new Date(settings.registrationOpens).toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" })} – {new Date(settings.submissionDeadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</div>
              <div className="text-xs text-ink-secondary mt-1">Submission closes 11:59 PM IST</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ART//CODE */}
      <section className="py-20 bg-cream border-b-2 border-mutedGold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion font-bold uppercase">
                <RhombusMotif size={16} />
                <span>01 // About ART//CODE</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl text-darkRed leading-tight">
                A celebration of creativity, culture, heritage, and technology.
              </h2>
              <div className="space-y-4 text-ink-secondary text-sm sm:text-base leading-relaxed">
                <p>
                  Bringing together student innovators, digital artists, and cultural enthusiasts to reimagine heritage, performing arts, folklore, and traditional craftsmanship through computational intelligence.
                </p>
                <p>
                  Unlike generic hackathons, ART//CODE 2026 asks students to draw inspiration from authentic Indian traditions—from the mineral pigment physics of Kerala frescoes and Kathakali Mudras to Dravidian script ligatures and Kasavu handloom geometry.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/event"
                  className="px-5 py-2.5 rounded-xl bg-darkRed text-cream text-xs font-bold uppercase tracking-wider hover:bg-vermilion transition-colors inline-flex items-center gap-2"
                >
                  <span>Learn More</span>
                  <ArrowRight size={13} className="text-accentGold" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-vermilion text-accentGold mx-auto flex items-center justify-center font-editorial text-3xl font-bold border-2 border-accentGold shadow-subtle">
                Δ
              </div>
              <h3 className="font-bold text-darkRed text-base uppercase font-mono tracking-wider">DELTA Association</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Department of Computer Science and Engineering (Data Science), Christ College of Engineering (Autonomous), Irinjalakuda. Empowering students to build creative, culturally rooted technological solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE CHALLENGES PREVIEW (Panel 06 Style) */}
      <section className="py-20 bg-paleCream border-b-2 border-mutedGold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion font-bold uppercase">
                <RhombusMotif size={16} />
                <span>02 // Problem Statements</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkRed mt-2">
                Problem Statements & Cultural Domains
              </h2>
              <p className="text-ink-secondary text-sm mt-2 max-w-2xl">
                Explore diverse challenges inspired by art, culture, heritage, and creative technology.
              </p>
            </div>
            <Link
              href="/challenges"
              className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-vermilion hover:text-darkRed inline-flex items-center gap-1 font-mono"
            >
              <span>Explore All Challenges</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.slice(0, 3).map((challenge) => (
              <div
                key={challenge.id}
                className="group flex flex-col justify-between p-6 rounded-card border-2 border-mutedGold bg-cream hover:border-vermilion hover:shadow-elevated transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <ChallengeMotif category={challenge.category} size={50} />
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-paleCream text-darkRed border border-mutedGold">
                      {challenge.code}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-vermilion font-bold">
                    {challenge.category}
                  </span>

                  <h3 className="text-base font-bold text-ink mt-2 group-hover:text-vermilion transition-colors line-clamp-2 leading-snug">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-ink-secondary mt-3 line-clamp-3 leading-relaxed">
                    {challenge.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-mutedGold/60">
                  <Link
                    href={`/challenges/${challenge.slug}`}
                    className="text-xs font-bold uppercase tracking-wider text-vermilion group-hover:text-darkRed inline-flex items-center gap-1.5 font-mono"
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TIMELINE */}
      <section className="py-20 bg-cream border-b-2 border-mutedGold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion font-bold uppercase">
              <RhombusMotif size={14} />
              <span>03 // Event Timeline</span>
              <RhombusMotif size={14} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkRed">
              Event Schedule & Milestones
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              All dates are configured in Indian Standard Time (IST). Mark these key milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timelineMilestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-card border-2 ${
                  m.highlight
                    ? "border-vermilion bg-paleCream shadow-poster"
                    : "border-mutedGold bg-cream shadow-subtle"
                } relative space-y-2`}
              >
                {m.highlight && (
                  <span className="absolute -top-3 right-4 text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-vermilion text-cream shadow-sm">
                    Hard Deadline
                  </span>
                )}
                <div className="text-xs font-mono font-bold text-vermilion uppercase">
                  {m.date}
                </div>
                <div className="text-base font-bold text-ink">{m.title}</div>
                <p className="text-xs text-ink-secondary leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRIZES SECTION (Panel 09 Layout) */}
      <section id="prizes" className="py-20 bg-paleCream border-b-2 border-mutedGold scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion font-bold uppercase">
              <RhombusMotif size={14} />
              <span>04 // Recognition</span>
              <RhombusMotif size={14} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkRed">
              Prizes & Merit Awards
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Total prize pool of ₹3,000 along with participation certificates for eligible participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto items-end">
            {/* 2nd Place */}
            <div className="p-8 rounded-card border-2 border-mutedGold bg-cream text-center flex flex-col justify-between order-2 md:order-1 shadow-subtle">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-darkRed font-bold">2nd Place</div>
                <div className="font-editorial text-4xl font-bold text-ink mt-3">₹1,000</div>
                <div className="text-xs font-semibold text-secondaryRed mt-1">Silver Merit Award</div>
                <p className="text-xs text-ink-secondary mt-4 leading-relaxed">
                  Second-highest scoring project demonstrating aesthetic depth and technical execution.
                </p>
              </div>
              <div className="pt-6 border-t border-mutedGold mt-6 text-[11px] font-mono text-darkRed font-semibold">
                Official DELTA Certificate
              </div>
            </div>

            {/* 1st Place (Centerpiece Highlight from Panel 09) */}
            <div className="p-9 rounded-card border-2 border-vermilion bg-cream shadow-poster text-center flex flex-col justify-between order-1 md:order-2 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-vermilion text-cream text-[10px] font-mono uppercase tracking-widest font-bold shadow-subtle border border-accentGold">
                Grand Winner
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-accentGold/20 text-vermilion mx-auto flex items-center justify-center mb-2 mt-2">
                  <Award size={26} />
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold">1st Place</div>
                <div className="font-editorial text-5xl font-black text-vermilion mt-2">₹1,500</div>
                <div className="text-xs font-bold text-darkRed mt-1">Gold Citation & Certificate</div>
                <p className="text-xs text-ink-secondary mt-4 leading-relaxed">
                  Best overall hackathon project evaluated across Innovation, Implementation, Cultural Relevance, UX, and Impact.
                </p>
              </div>
              <div className="pt-6 border-t border-mutedGold mt-6 text-[11px] font-mono text-vermilion font-bold">
                Gold Citation & Trophy
              </div>
            </div>

            {/* 3rd Place */}
            <div className="p-8 rounded-card border-2 border-mutedGold bg-cream text-center flex flex-col justify-between order-3 shadow-subtle">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-darkRed font-bold">3rd Place</div>
                <div className="font-editorial text-4xl font-bold text-ink mt-3">₹500</div>
                <div className="text-xs font-semibold text-secondaryRed mt-1">Bronze Merit Award</div>
                <p className="text-xs text-ink-secondary mt-4 leading-relaxed">
                  Third-highest scoring project for originality, craftsmanship, and feasibility.
                </p>
              </div>
              <div className="pt-6 border-t border-mutedGold mt-6 text-[11px] font-mono text-darkRed font-semibold">
                Official DELTA Certificate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GUIDELINES PREVIEW */}
      <section className="py-20 bg-cream border-b-2 border-mutedGold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion font-bold uppercase">
                <RhombusMotif size={16} />
                <span>05 // Guidelines & Rubric</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkRed">
                Clear Guidelines for Rigorous Craft.
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Review the core rules, deliverables checklist, and 100-point rubric before starting.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Teams must consist of exactly two registered members (no solo, no trios).",
                  "All project work must be developed during the official hackathon window.",
                  "GitHub repository must include a well-structured README and setup commands.",
                  "Deliverable links (Google Drive video + presentation) must be publicly accessible.",
                  "Scored out of 100 points: Innovation (25), Tech (25), Culture (20), UX (15), Impact (15).",
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-vermilion mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-ink font-medium leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/guidelines"
                  className="px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors inline-flex items-center gap-2"
                >
                  <span>Read Complete Guidelines</span>
                  <ArrowRight size={14} className="text-accentGold" />
                </Link>
              </div>
            </div>

            {/* Rubric Card */}
            <div className="lg:col-span-6 p-6 sm:p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle">
              <h3 className="text-xs font-bold text-darkRed uppercase tracking-wider font-mono border-b border-mutedGold pb-3 flex items-center justify-between">
                <span>Evaluation Rubric (100 Points)</span>
                <span className="text-vermilion font-bold">DELTA FACULTY RUBRIC</span>
              </h3>
              <div className="divide-y divide-mutedGold/60 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <span className="font-semibold text-ink">Innovation and Originality</span>
                  <span className="font-mono font-bold text-vermilion">25 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-semibold text-ink">Technical Implementation & Architecture</span>
                  <span className="font-mono font-bold text-darkRed">25 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-semibold text-ink">Relevance to Heritage & Cultural Theme</span>
                  <span className="font-mono font-bold text-vermilion">20 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-semibold text-ink">User Experience, Design & Accessibility</span>
                  <span className="font-mono font-bold text-secondaryRed">15 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-semibold text-ink">Potential Impact and Feasibility</span>
                  <span className="font-mono font-bold text-ink">15 Marks</span>
                </div>
                <div className="pt-4 flex justify-between items-center font-bold text-sm text-darkRed border-t-2 border-mutedGold">
                  <span>Total Mark Capacity</span>
                  <span className="font-mono text-base text-vermilion">100 / 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQS */}
      <section id="faqs" className="py-20 bg-paleCream border-b-2 border-mutedGold scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion font-bold uppercase">
              <RhombusMotif size={14} />
              <span>06 // Common Questions</span>
              <RhombusMotif size={14} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-darkRed">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Everything you need to know about team eligibility, submissions, and guidelines.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-card border-2 border-mutedGold bg-cream shadow-subtle text-left"
              >
                <h3 className="text-base font-bold text-darkRed">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-ink-secondary mt-3 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION (Full-width Vermilion Banner as specified in Section 4) */}
      <section className="py-20 bg-vermilion text-cream text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-ornate-weave opacity-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <div className="w-12 h-12 rounded-full bg-accentGold/20 text-accentGold mx-auto flex items-center justify-center border border-accentGold/50">
            <RhombusMotif size={24} color="#F1B321" />
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl text-cream italic leading-tight">
            Your Culture. Your Code. Your Creation.
          </h2>

          <p className="text-sm sm:text-base text-cream/90 max-w-xl mx-auto leading-relaxed">
            Form your two-member team and join student innovators across disciplines to build creative technology celebrating art and heritage.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl bg-accentGold text-darkRed font-bold text-xs uppercase tracking-wider hover:bg-cream transition-colors shadow-poster flex items-center gap-2"
            >
              <span>Register for ART//CODE</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

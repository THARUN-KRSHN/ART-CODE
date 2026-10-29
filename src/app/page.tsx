import React from "react";
import Link from "next/link";
import { HeroArtwork } from "@/components/art/HeroArtwork";
import { ChallengeMotif } from "@/components/art/ChallengeMotif";
import { getChallenges, getEventSettings } from "@/lib/store";
import {
  Calendar,
  Users,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const challenges = getChallenges();
  const settings = getEventSettings();

  const timelineMilestones = [
    {
      date: "29 Oct 2026",
      title: "Registration Opens",
      desc: "Participant onboarding and team formation begins",
      status: "active",
    },
    {
      date: "30 Oct 2026",
      title: "Submission Portal Opens",
      desc: "Teams can commence drafting their project details",
      status: "upcoming",
    },
    {
      date: "08 Nov 2026",
      title: "Submission Deadline",
      desc: "11:59 PM IST — Final project locking and confirmation",
      status: "upcoming",
      highlight: true,
    },
    {
      date: "14 Nov 2026",
      title: "Winner Announcement",
      desc: "Evaluation completed and results officially unveiled",
      status: "upcoming",
    },
  ];

  const faqs = [
    {
      q: "What is the team size requirement for ART//CODE 2026?",
      a: "Each team must consist of exactly 2 members. Solitary participants cannot submit projects, and teams cannot exceed two members. The platform enforces this strictly at the submission gateway.",
    },
    {
      q: "Who is eligible to participate?",
      a: "Students passionate about computer science, artificial intelligence, generative media, art history, and creative technology are welcome. Interdisciplinary collaborations are strongly encouraged.",
    },
    {
      q: "What deliverables are required during final submission?",
      a: "Teams must provide: (1) Project title, description, and technical architecture, (2) A public GitHub repository with comprehensive README, (3) A working demo or live URL, and (4) A Google Drive folder containing a 3–5 min demonstration video and 6–10 slide presentation.",
    },
    {
      q: "Can we edit our submission after finalizing?",
      a: "You can save drafts freely before the deadline. However, once the Team Leader selects 'Finalize & Lock Submission', the record becomes permanently immutable to ordinary participants.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-ivory to-white border-b border-border">
        {/* Subtle background mandala grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory-200 border border-border text-[11px] font-mono tracking-wider uppercase text-ink-secondary">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                DELTA PRESENTS // VIRTUAL HACKATHON
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink font-sans leading-[1.08]">
                ART<span className="text-terracotta font-serif font-normal italic">//</span>CODE{" "}
                <span className="block text-3xl sm:text-5xl font-light text-ink-secondary mt-1">
                  2026
                </span>
              </h1>

              <p className="font-editorial text-2xl sm:text-3xl text-ink-secondary italic leading-snug">
                Where Creativity Meets Technology.
              </p>

              <p className="text-base sm:text-lg text-ink-secondary max-w-xl font-normal leading-relaxed">
                A minimal virtual hackathon uniting student engineers, digital artists, and cultural archivists to reimagine heritage, folklore, performing arts, and traditional craftsmanship through computational intelligence.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="px-6 py-3.5 rounded-xl bg-ink text-white font-semibold text-sm hover:bg-ink-pure transition-all shadow-subtle hover:shadow-elevated flex items-center gap-2"
                >
                  <span>Register Now</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/challenges"
                  className="px-6 py-3.5 rounded-xl bg-white border border-border text-ink font-semibold text-sm hover:bg-ivory-100 transition-colors shadow-subtle"
                >
                  Explore Challenges
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-ink-muted font-mono">
                <div>// CHRIST COLLEGE OF ENGINEERING</div>
                <div>•</div>
                <div>AUTONOMOUS INSTITUTION</div>
              </div>
            </div>

            {/* Right Abstract Art */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroArtwork />
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVENT INFORMATION CARDS */}
      <section className="py-12 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-card border border-border/80 bg-ivory-50/60 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-terracotta-50 text-terracotta flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ink-muted">Event Format</div>
              <div className="text-lg font-bold text-ink mt-1">Virtual Hackathon</div>
              <div className="text-xs text-ink-secondary mt-1">Decentralized & remote collaboration</div>
            </div>

            <div className="p-6 rounded-card border border-border/80 bg-ivory-50/60 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ink-muted">Team Size</div>
              <div className="text-lg font-bold text-ink mt-1">Exactly 2 Members</div>
              <div className="text-xs text-ink-secondary mt-1">Strict pair programming rule</div>
            </div>

            <div className="p-6 rounded-card border border-border/80 bg-ivory-50/60 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center mb-4">
                <Clock size={20} />
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ink-muted">Submission Deadline</div>
              <div className="text-lg font-bold text-ink mt-1">8 Nov 2026</div>
              <div className="text-xs text-ink-secondary mt-1">11:59 PM IST (Indian Standard Time)</div>
            </div>

            <div className="p-6 rounded-card border border-border/80 bg-ivory-50/60 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-sage-50 text-status-success flex items-center justify-center mb-4">
                <Award size={20} />
              </div>
              <div className="text-xs uppercase font-mono tracking-wider text-ink-muted">Total Prize Pool</div>
              <div className="text-lg font-bold text-ink mt-1">₹3,000 Cash</div>
              <div className="text-xs text-ink-secondary mt-1">1st ₹1,500 • 2nd ₹1,000 • 3rd ₹500</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ART//CODE */}
      <section className="py-20 bg-ivory border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="text-xs font-mono tracking-widest text-terracotta uppercase">
                Section 01 // Curation Statement
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl text-ink leading-tight">
                An exhibition of thought: Moving beyond conventional hackathons.
              </h2>
              <div className="space-y-4 text-ink-secondary text-base leading-relaxed">
                <p>
                  Most hackathons celebrate sheer speed and commercial utility. ART//CODE 2026 takes a different trajectory. Organized by DELTA (Data Science Department Association) at Christ College of Engineering (Autonomous), Irinjalakuda, this edition invites participants to explore the delicate threshold where ancient craftsmanship, ritual geometry, and indigenous culture converge with artificial intelligence and modern computational systems.
                </p>
                <p>
                  From restoring weathered mineral frescoes through neural models to sonifying classical dance mudras and decoding handloom fractals into algorithmic matrices, every challenge encourages reverence for cultural tradition balanced by technical rigor.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                <div className="border-l-2 border-terracotta pl-4">
                  <div className="text-2xl font-bold text-ink">5 Domains</div>
                  <div className="text-xs text-ink-muted">From AI Frescoes to WebXR</div>
                </div>
                <div className="border-l-2 border-indigo pl-4">
                  <div className="text-2xl font-bold text-ink">100 Pts</div>
                  <div className="text-xs text-ink-muted">Holistic Evaluation Rubric</div>
                </div>
                <div className="border-l-2 border-sage pl-4">
                  <div className="text-2xl font-bold text-ink">Strict Pairs</div>
                  <div className="text-xs text-ink-muted">Two Minds, Unified Code</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-8 rounded-card border border-border bg-white shadow-subtle space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-ivory-200 border border-border mx-auto flex items-center justify-center text-terracotta font-serif text-2xl font-bold">
                Δ
              </div>
              <h3 className="font-bold text-ink text-base">DELTA Association</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Department of Data Science Association, Christ College of Engineering (Autonomous), Irinjalakuda. Empowering students to build principled, creative, and culturally conscious computational software.
              </p>
              <div className="pt-2">
                <Link
                  href="/event"
                  className="text-xs font-semibold text-terracotta hover:text-terracotta-700 inline-flex items-center gap-1"
                >
                  Read Event Overview <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE CHALLENGES */}
      <section className="py-20 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-mono tracking-widest text-indigo uppercase">
                Section 02 // Problem Statements
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink font-sans mt-2">
                Explore the Challenges
              </h2>
              <p className="text-ink-secondary text-sm sm:text-base mt-2 max-w-2xl">
                Five problem statements designed at the intersection of creative arts and technical excellence.
              </p>
            </div>
            <Link
              href="/challenges"
              className="mt-4 md:mt-0 text-sm font-semibold text-terracotta hover:underline inline-flex items-center gap-1"
            >
              View Detailed Specs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="group flex flex-col justify-between p-6 rounded-card border border-border/90 bg-white hover:border-terracotta/60 hover:shadow-elevated transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <ChallengeMotif
                      category={challenge.category}
                      accent={challenge.accentColor}
                      size={52}
                    />
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-ivory-200 text-ink-secondary border border-border">
                      {challenge.code}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-terracotta font-semibold">
                    {challenge.category}
                  </span>

                  <h3 className="text-base font-bold text-ink mt-2 group-hover:text-terracotta transition-colors line-clamp-2 leading-snug">
                    {challenge.title}
                  </h3>

                  <p className="text-xs text-ink-secondary mt-3 line-clamp-3 leading-relaxed">
                    {challenge.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={`/challenges/${challenge.slug}`}
                    className="text-xs font-semibold text-ink group-hover:text-terracotta inline-flex items-center gap-1.5"
                  >
                    <span>View Challenge</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. IMPORTANT DATES (TIMELINE) */}
      <section className="py-20 bg-ivory border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono tracking-widest text-terracotta uppercase">
              Section 03 // Timeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-sans mt-2">
              Event Schedule & Milestones
            </h2>
            <p className="text-sm text-ink-secondary mt-2">
              All dates are configured in Indian Standard Time (IST). Mark these key checkpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {timelineMilestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-card border ${
                  m.highlight
                    ? "border-terracotta bg-white shadow-elevated"
                    : "border-border bg-white/70 shadow-subtle"
                } relative`}
              >
                {m.highlight && (
                  <span className="absolute -top-3 right-6 text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-terracotta text-white">
                    Critical Deadline
                  </span>
                )}
                <div className="text-xs font-mono font-semibold text-terracotta uppercase">
                  {m.date}
                </div>
                <div className="text-base font-bold text-ink mt-2">{m.title}</div>
                <p className="text-xs text-ink-secondary mt-2 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRIZES SECTION */}
      <section id="prizes" className="py-20 bg-white border-b border-border scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono tracking-widest text-saffron-600 uppercase">
              Section 04 // Recognition
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-sans mt-2">
              Prizes & Merit Awards
            </h2>
            <p className="text-sm text-ink-secondary mt-2">
              Total prize pool of ₹3,000 supported by DELTA, along with institutional certificates of excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Second Prize */}
            <div className="p-8 rounded-card border border-border bg-ivory-50 text-center flex flex-col justify-between order-2 md:order-1">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-ink-muted">2nd Place</div>
                <div className="font-editorial text-4xl font-bold text-ink mt-3">₹1,000</div>
                <div className="text-xs font-medium text-ink-secondary mt-1">Silver Merit Award</div>
                <p className="text-xs text-ink-muted mt-4 leading-relaxed">
                  Awarded to the second-highest scoring project demonstrating technical refinement and artistic synthesis.
                </p>
              </div>
              <div className="pt-6 border-t border-border mt-6 text-xs font-mono text-ink-muted">
                Official DELTA Certificate
              </div>
            </div>

            {/* First Prize */}
            <div className="p-8 rounded-card border-2 border-terracotta bg-white shadow-elevated text-center flex flex-col justify-between order-1 md:order-2 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-ink text-white text-[10px] font-mono uppercase tracking-widest font-bold">
                Grand Winner
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-terracotta font-bold mt-2">1st Place</div>
                <div className="font-editorial text-5xl font-bold text-terracotta mt-3">₹1,500</div>
                <div className="text-xs font-medium text-ink mt-1">First Merit Excellence</div>
                <p className="text-xs text-ink-secondary mt-4 leading-relaxed">
                  Best overall hackathon project scoring across Innovation, Technical Implementation, Cultural Relevance, UX, and Impact.
                </p>
              </div>
              <div className="pt-6 border-t border-border mt-6 text-xs font-mono text-ink font-semibold">
                Gold Citation & Certificate
              </div>
            </div>

            {/* Third Prize */}
            <div className="p-8 rounded-card border border-border bg-ivory-50 text-center flex flex-col justify-between order-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-ink-muted">3rd Place</div>
                <div className="font-editorial text-4xl font-bold text-ink mt-3">₹500</div>
                <div className="text-xs font-medium text-ink-secondary mt-1">Bronze Merit Award</div>
                <p className="text-xs text-ink-muted mt-4 leading-relaxed">
                  Awarded to the third-highest scoring creative team for innovation and feasibility.
                </p>
              </div>
              <div className="pt-6 border-t border-border mt-6 text-xs font-mono text-ink-muted">
                Official DELTA Certificate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GUIDELINES PREVIEW */}
      <section className="py-20 bg-ivory border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono tracking-widest text-sage-600 uppercase">
                Section 05 // Rules & Rubric
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink font-sans">
                Clear Guidelines for Rigorous Craft.
              </h2>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Transparent rules ensure parity, ethics, and a level playing field for all student participants.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Teams must have exactly two registered members (no solo, no trios).",
                  "All work must be developed during the hackathon period.",
                  "GitHub repository must include a well-documented README and clear setup instructions.",
                  "Deliverable links (Google Drive video + presentation) must be publicly accessible to judges.",
                  "Evaluation uses a 100-point rubric spanning innovation, code quality, and cultural fidelity.",
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-status-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-ink leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/guidelines"
                  className="px-5 py-2.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors inline-flex items-center gap-2"
                >
                  <span>Read Complete Guidelines & Rubric</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 rounded-card border border-border bg-white shadow-subtle">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-mono border-b border-border pb-3">
                Evaluation Rubric (100 Points)
              </h3>
              <div className="divide-y divide-border/60 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <span className="font-medium text-ink">Innovation and Originality</span>
                  <span className="font-mono font-bold text-terracotta">25 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-medium text-ink">Technical Implementation & Architecture</span>
                  <span className="font-mono font-bold text-indigo">25 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-medium text-ink">Relevance to Heritage & Cultural Theme</span>
                  <span className="font-mono font-bold text-saffron-600">20 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-medium text-ink">User Experience, Design & Accessibility</span>
                  <span className="font-mono font-bold text-sage-600">15 Marks</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="font-medium text-ink">Potential Impact and Feasibility</span>
                  <span className="font-mono font-bold text-ink">15 Marks</span>
                </div>
                <div className="pt-4 flex justify-between items-center font-bold text-sm text-ink">
                  <span>Total Mark Capacity</span>
                  <span className="font-mono">100 / 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faqs" className="py-20 bg-white border-b border-border scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs font-mono tracking-widest text-indigo uppercase">
              Section 06 // Common Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink font-sans mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-ink-secondary mt-2">
              Everything you need to know about team eligibility, submissions, and rules.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-card border border-border bg-ivory-50/70 shadow-subtle text-left"
              >
                <h3 className="text-base font-bold text-ink">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-ink-secondary mt-3 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="py-16 bg-ivory text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-editorial text-3xl sm:text-4xl text-ink leading-tight">
            Ready to merge computational code with cultural heritage?
          </h2>
          <p className="text-sm text-ink-secondary mt-3">
            Form your two-member team and register today for ART//CODE 2026.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-ink text-white font-semibold text-sm hover:bg-ink-pure transition-colors shadow-subtle"
            >
              Start Participant Registration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


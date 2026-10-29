import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Award, Users, Calendar, ArrowRight } from "lucide-react";

export default function EventPage() {
  return (
    <div className="min-h-screen bg-ivory py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="text-xs font-semibold text-ink-secondary hover:text-terracotta inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="text-xs font-mono tracking-widest text-terracotta uppercase">
            Curatorial Brief // ART//CODE 2026
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-ink leading-tight">
            Where Creativity Meets Technology.
          </h1>

          <p className="text-base sm:text-lg text-ink-secondary font-normal leading-relaxed pt-2">
            A comprehensive overview of the inaugural virtual hackathon curated by the Data Science Department Association (DELTA) at Christ College of Engineering (Autonomous), Irinjalakuda.
          </p>
        </div>

        {/* Section: The Vision */}
        <section className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-indigo font-bold">
            01 // The Vision & Philosophy
          </h2>
          <h3 className="font-editorial text-2xl text-ink">
            Bridging Ancient Crafts and Computational Futures
          </h3>
          <p className="text-sm text-ink-secondary leading-relaxed">
            ART//CODE 2026 is founded on the recognition that traditional artistic expressions—from South Indian mineral fresco restoration and Dravidian script ligatures to classical dance mudras and Kasavu handloom geometry—possess deeply sophisticated internal logic.
          </p>
          <p className="text-sm text-ink-secondary leading-relaxed">
            By challenging engineering students to engage with indigenous culture through the lens of modern computing (computer vision, neural inpainting, WebXR spatial acoustics, and algorithmic design), the event reframes cultural preservation not as nostalgic archiving, but as an active, living, technological frontier.
          </p>
        </section>

        {/* Section: Primary Objectives */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-terracotta font-bold">
              02 // Event Objectives
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-card border border-border bg-white space-y-2">
              <span className="text-xs font-mono font-bold text-terracotta">OBJ-01</span>
              <h4 className="text-base font-bold text-ink">Interdisciplinary Innovation</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Encourage computer science and data science students to collaborate on humanistic and cultural challenges that demand aesthetic sensitivity alongside mathematical rigor.
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-white space-y-2">
              <span className="text-xs font-mono font-bold text-indigo">OBJ-02</span>
              <h4 className="text-base font-bold text-ink">Strict Pair Dynamics</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Foster deep peer collaboration through mandatory two-member teams, ensuring every participant shares active programming and architectural responsibilities.
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-white space-y-2">
              <span className="text-xs font-mono font-bold text-saffron-600">OBJ-03</span>
              <h4 className="text-base font-bold text-ink">Ethical Cultural Stewardship</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Ensure computational models respect traditional iconographic canons (such as Talmana proportions and historical pigment physics) rather than generating unconstrained modern distortions.
              </p>
            </div>

            <div className="p-6 rounded-card border border-border bg-white space-y-2">
              <span className="text-xs font-mono font-bold text-sage-600">OBJ-04</span>
              <h4 className="text-base font-bold text-ink">Reusable Platform Heritage</h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Deploy an accessible, persistent platform developed specifically for DELTA that can be adapted for subsequent editions and departmental symposia.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Key Event Details Table */}
        <section className="p-8 rounded-card border border-border bg-white shadow-subtle space-y-6">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink font-bold">
              03 // Official Event Registry
            </h2>
            <span className="text-[11px] font-mono text-ink-muted">CCE // AUTONOMOUS</span>
          </div>

          <div className="divide-y divide-border/60 text-xs sm:text-sm">
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Event Name</span>
              <span className="sm:col-span-2 text-ink font-medium">ART//CODE 2026</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Theme</span>
              <span className="sm:col-span-2 text-ink font-medium">Art, Culture, Heritage & Creative Technology</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Organising Body</span>
              <span className="sm:col-span-2 text-ink font-medium">
                DELTA — Data Science Department Association, Christ College of Engineering (Autonomous), Irinjalakuda
              </span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Format</span>
              <span className="sm:col-span-2 text-ink font-medium">Virtual / Remote Online Hackathon</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Team Size Requirement</span>
              <span className="sm:col-span-2 text-ink font-semibold text-terracotta">Exactly 2 Members (Strict Limit)</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Submission Window</span>
              <span className="sm:col-span-2 text-ink font-medium">30 October 2026 – 8 November 2026 (11:59 PM IST)</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Winner Announcement</span>
              <span className="sm:col-span-2 text-ink font-medium">14 November 2026</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-semibold text-ink-secondary">Prize Structure</span>
              <span className="sm:col-span-2 text-ink font-medium">Total ₹3,000 (₹1,500 1st • ₹1,000 2nd • ₹500 3rd)</span>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <div className="p-8 rounded-card border border-border bg-ivory-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-base font-bold text-ink">Explore the Problem Statements</h4>
            <p className="text-xs text-ink-secondary mt-1">
              Select the cultural domain that aligns best with your team's technical expertise.
            </p>
          </div>
          <Link
            href="/challenges"
            className="px-5 py-2.5 rounded-lg bg-ink text-white text-xs font-semibold hover:bg-ink-pure transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            <span>Browse Challenges</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}


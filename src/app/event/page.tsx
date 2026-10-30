import React from "react";
import Link from "next/link";
import { RhombusMotif } from "@/components/art/CulturalMotifs";
import { ArrowLeft, Sparkles, Award, Users, Calendar, ArrowRight } from "lucide-react";

export default function EventPage() {
  return (
    <div className="min-h-screen bg-cream text-ink py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="text-xs font-mono font-bold uppercase tracking-wider text-secondaryRed hover:text-vermilion inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-vermilion uppercase font-bold">
            <RhombusMotif size={14} />
            <span>Curatorial Brief // ART//CODE 2026</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl text-darkRed leading-tight">
            About ART//CODE
          </h1>

          <p className="font-editorial text-2xl text-secondaryRed italic leading-snug">
            A celebration of creativity, culture, heritage, and technology.
          </p>

          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed pt-2">
            Bringing together student innovators, digital artists, and cultural enthusiasts to reimagine heritage, performing arts, folklore, and traditional craftsmanship through computational intelligence.
          </p>
        </div>

        {/* Section 2: Event Philosophy */}
        <section className="p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
            <RhombusMotif size={14} />
            <span>01 // The Cultural & Technological Vision</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-darkRed">
            Traditional in Expression. Contemporary in Layout. Functional in Interaction.
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            ART//CODE 2026 is grounded in the conviction that indigenous art forms—from the mineral pigment chemistry of Kerala temple murals to classical dance Mudras and ancient scripts—embody sophisticated mathematical and physical principles.
          </p>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
            Organised by DELTA (Department of Computer Science and Engineering - Data Science) at Christ College of Engineering (Autonomous), Irinjalakuda, this platform challenges students to apply computer vision, machine learning, generative design, and spatial audio to preserve, document, and celebrate living cultural heritage.
          </p>
        </section>

        {/* Section 3: 4 Core Pillars (Panel 05 Style) */}
        <section className="space-y-6">
          <div className="border-b-2 border-mutedGold pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold flex items-center gap-2">
              <RhombusMotif size={14} />
              <span>02 // Core Event Pillars</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-2">
              <div className="w-12 h-12 rounded-full bg-vermilion/10 text-vermilion flex items-center justify-center mx-auto mb-2">
                <Sparkles size={22} />
              </div>
              <h3 className="font-bold text-darkRed text-sm">Art & Culture</h3>
              <p className="text-[11px] text-ink-secondary">Reinterpreting classical iconography</p>
            </div>

            <div className="p-5 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-2">
              <div className="w-12 h-12 rounded-full bg-accentGold/20 text-darkRed flex items-center justify-center mx-auto mb-2">
                <Award size={22} />
              </div>
              <h3 className="font-bold text-darkRed text-sm">Heritage</h3>
              <p className="text-[11px] text-ink-secondary">Preserving endangered craftsmanship</p>
            </div>

            <div className="p-5 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-2">
              <div className="w-12 h-12 rounded-full bg-vermilion/10 text-vermilion flex items-center justify-center mx-auto mb-2">
                <Sparkles size={22} />
              </div>
              <h3 className="font-bold text-darkRed text-sm">Innovation</h3>
              <p className="text-[11px] text-ink-secondary">Computational & generative systems</p>
            </div>

            <div className="p-5 rounded-card border-2 border-mutedGold bg-cream shadow-subtle space-y-2">
              <div className="w-12 h-12 rounded-full bg-accentGold/20 text-darkRed flex items-center justify-center mx-auto mb-2">
                <Users size={22} />
              </div>
              <h3 className="font-bold text-darkRed text-sm">Community</h3>
              <p className="text-[11px] text-ink-secondary">Pair programming collaboration</p>
            </div>
          </div>
        </section>

        {/* Section 4: Official Event Information Table */}
        <section className="p-8 rounded-card border-2 border-mutedGold bg-paleCream shadow-subtle space-y-6">
          <div className="border-b-2 border-mutedGold pb-3 flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-darkRed font-bold flex items-center gap-2">
              <RhombusMotif size={14} />
              <span>03 // Official Event Registry</span>
            </h2>
            <span className="text-[11px] font-mono text-darkRed font-semibold">DELTA • CCE</span>
          </div>

          <div className="divide-y divide-mutedGold/60 text-xs sm:text-sm">
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Event Name</span>
              <span className="sm:col-span-2 text-ink font-semibold">ART//CODE 2026</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Theme</span>
              <span className="sm:col-span-2 text-ink">Art × Culture × Heritage × Technology</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Organising Body</span>
              <span className="sm:col-span-2 text-ink">
                DELTA - Department of Computer Science and Engineering (Data Science)
              </span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Institution</span>
              <span className="sm:col-span-2 text-ink">
                Christ College of Engineering (Autonomous), Irinjalakuda
              </span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Format</span>
              <span className="sm:col-span-2 text-ink">Virtual / Online Hackathon</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Team Size</span>
              <span className="sm:col-span-2 text-vermilion font-bold">Exactly 2 Members (Strict Limit)</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Submission Window</span>
              <span className="sm:col-span-2 text-ink">30 October 2026 – 8 November 2026 (11:59 PM IST)</span>
            </div>
            <div className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <span className="font-bold text-darkRed">Prizes</span>
              <span className="sm:col-span-2 text-ink font-semibold">₹3,000 Total Pool (₹1,500 1st • ₹1,000 2nd • ₹500 3rd)</span>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <div className="p-8 rounded-card border-2 border-vermilion bg-cream flex flex-col sm:flex-row items-center justify-between gap-6 shadow-poster">
          <div>
            <h4 className="text-base font-bold text-darkRed">Ready to explore the problem statements?</h4>
            <p className="text-xs text-ink-secondary mt-1">
              Select the cultural track that matches your team's creative and technical goals.
            </p>
          </div>
          <Link
            href="/challenges"
            className="px-6 py-3 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed transition-colors inline-flex items-center gap-2 flex-shrink-0 shadow-subtle"
          >
            <span>Browse Challenges</span>
            <ArrowRight size={14} className="text-accentGold" />
          </Link>
        </div>
      </div>
    </div>
  );
}

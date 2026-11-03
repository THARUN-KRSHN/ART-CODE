# ART//CODE 2026 - Virtual Hackathon Platform
**Where Creativity Meets Technology.**

Organised by **DELTA - Data Science Department Association**  
**Christ College of Engineering (Autonomous), Irinjalakuda**  
**Event Theme:** Art, Culture, Heritage & Creative Technology  

---

## 🏛️ Platform Architecture & Philosophy

ART//CODE 2026 is a responsive web application designed to manage the complete lifecycle of a student hackathon with an editorial aesthetic inspired by abstract cultural art, traditional craftsmanship, and contemporary digital creativity.

### Core Visual Tokens
- **Warm Ivory (`#FAF8F3`)**: Main surface background
- **Pure White (`#FFFFFF`)**: Content panels, cards, and structured forms
- **Ink Black (`#20201E`)**: High-contrast editorial typography
- **Cultural Accents**: Terracotta (`#C66A4A`), Deep Indigo (`#414B75`), Saffron Gold (`#D5A545`), Sage Green (`#82947B`)
- **Typography**: Display/sans-serif (Plus Jakarta Sans / Manrope) + Editorial Accent (DM Serif Display)
- **Original Abstract SVG Art**: Custom mathematical and cultural motifs representing mural inpainting, temple acoustics, handloom matrices, mudras, and ligatures.

---

## 🚀 Key Features Implemented (Phase 1 Essentials)

1. **Public Website (`/`, `/event`, `/challenges`, `/guidelines`, `/results`)**
   - **Hero Section**: Editorial split-layout with bespoke exhibition-grade abstract poster SVG (`HeroArtwork`).
   - **4 Key Stat Cards**: Virtual format, strictly 2 members per team, 10 Nov deadline, ₹3,000 cash pool.
   - **5 Curated Problem Statements**:
     - `CH-01`: Living Archives - Generative AI for Indigenous Mural & Fresco Restoration
     - `CH-02`: Symphony of Mudras - Real-time Computer Vision for Classical Dance Synthesis
     - `CH-03`: Kalam & Code - Dynamic Typography Engine for Dravidian Calligraphy
     - `CH-04`: Woven Geometry - Algorithmic Loom & Pattern Synthesis for Traditional Handloom
     - `CH-05`: Temple of Resonance - Spatial Audio & Interactive Web AR for Heritage Architecture
   - **Timeline & Milestones**: Horizontal/vertical milestones with critical deadline callout.
   - **Prizes Section**: 1st (₹1,500), 2nd (₹1,000), 3rd (₹500).
   - **Guidelines & 100-Point Rubric**: Copyable README template, video and presentation specifications, and disqualification criteria.

2. **Authentication & Profile Setup (`/login`, `/register`, `/onboarding`)**
   - Simulated OAuth authentication with Google and GitHub, plus institutional email signin.
   - Onboarding form with validation for name, phone, college, department, and academic year.

3. **Team Management & Strict 2-Member Rule (`/team`, `/team/workspace`)**
   - Create team (creator assigned as **Team Leader**).
   - Unique 8-character invitation code generator (e.g. `ART-4491`) with one-click copy.
   - Join team gateway with real-time membership slot validation (strictly max 2 members).
   - **Strict Submission Gate**: Project submission remains unavailable until both member slots are filled.

4. **Guided Project Submission & Permanent Locking (`/submission`, `/submission/confirmation`)**
   - 3-Stage guided workflow (Project Details, Deliverables Checklist, Review & Lock).
   - Draft saving capability (accessible only to the Team Leader).
   - Server-side Zod validation for required fields, tech stack, and URLs.
   - Mandatory originality declaration checkbox.
   - On final submit: Generates permanent Reference ID (e.g. `AC26-SUB-4491`), records timestamp in IST, and permanently locks participant editing (`isLocked: true`).
   - Official submission receipt with celebratory abstract motif.

5. **In-App Notifications (`/notifications`)**
   - Targeted bulletins (`all`, `complete_teams`, `incomplete_teams`, `not_submitted`).
   - Read/unread tracking and priority indicators (`urgent`, `important`, `normal`).

6. **Administrative Dashboard (`/admin`, `/admin/participants`, `/admin/teams`, `/admin/submissions`, `/admin/announcements`, `/admin/settings`)**
   - Metric summary cards (Participants, Teams, Complete/Incomplete, Drafts, Locked).
   - Submissions by challenge breakdown and server audit log.
   - Participant roster with search, filter, and CSV export.
   - Team roster with member breakdown and invitation code status.
   - Submission inspection viewer with emergency administrative unlock/reopen capability (with mandatory justification logged to audit trail per FR-19).
   - Announcement composer with cohort targeting.
   - Event settings manager for deadlines, prize pools, and results publication toggle.

7. **Interactive Role Simulator (Evaluation Feature)**
   - Located in the navigation bar. Allows immediate switching between:
     - Public Visitor
     - Team Leader: Ananya Nair (*Team KalaKriti*, Complete Team)
     - Teammate: Rohan Varma (*Team KalaKriti*)
     - Solo Leader: Meera Pillai (*Team Dhwani*, Incomplete Team)
     - Administrator: Dr. Arun Mohan (*DELTA Faculty Lead*)

---

## 🛠️ Tech Stack & Database Architecture

- **Framework**: Next.js 14 App Router with TypeScript
- **Styling**: Tailwind CSS with custom editorial design tokens
- **Icons**: Lucide React
- **Validation**: Zod
- **Persistence**: File-backed database (`data/artcode_db.json`) for seamless local execution and evaluation
- **Production Supabase SQL**: `supabase/schema.sql` containing complete PostgreSQL DDL, Row-Level Security (RLS) policies, foreign keys, and indexes.

---

## 🏃 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Hero figure and ink aura

The homepage uses the transparent cutout at `public/img/hero-figure.webp`.

- **Primary controls:** edit the exported constants at the top of `src/components/art/InkAura.tsx`: `INTRO_DURATION` (7000ms), `STRING_COUNT` (72), `STRING_MIN_WIDTH` (1.5px), `STRING_MAX_WIDTH` (3.5px), `STREAM_COUNT` (12), `STREAM_OPACITY_NEAR` (0.55), and `STREAM_OPACITY_FAR` (0.125). Mobile uses half of both counts. Fifteen percent of strings can reach 5px before tapering.
- **Palette and continuous speed:** `AURA_CONFIG` retains the 60% ink / 40% paint mix and 0.3× string parallax. `speed: 0.5` halves the continuous motion without changing the intro duration. Its six paint colors also color the waterfall.
- **Waterfall shape:** `STREAM_CONFIG` controls 0.85× stream parallax, 30–140px ribbon widths, and 12–20s flow cycles. Tiny pre-rendered feathered pigment sprites avoid per-frame blur filters on desktop and mobile.
- **Attachment points:** `ANCHORS` in the same file are normalized image coordinates for the hair, hands, saree and ribbons. Every strand remains connected to one of these points.
- **Optional ripple:** set `ENABLE_RIPPLE = false` in `src/components/art/HeroFigure.tsx` to remove the SVG filter entirely. It is automatically disabled below 768px and for reduced motion.
- **Figure size, hem dissolve and animations:** edit `.hero-figure`, the image mask (opaque through 78%, transparent at 100%), and the `hf-*` keyframes in `src/app/globals.css` (520px desktop, up to 360px mobile).

The dependency-free canvas shares one animation clock and one 0–1 intro progress value for strings and waterfall. Strings unfurl over roughly 6s; staggered streams start around 1.5s and reach the footer by 7s. The intro runs on the initial homepage document load only, not on client-side navigation. Content is immediately visible throughout.

The canvas is viewport-sized, caps device pixel ratio at 2, pauses in hidden tabs, draws only visible stream rows, and protects text and solid cards using a cached feathered viewport mask. Reduced motion skips the intro and renders the final composition statically; scrolling only repositions that drawing. The effect covers the homepage through its shared footer and is removed on navigation to other routes.

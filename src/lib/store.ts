import fs from "fs";
import path from "path";
import {
  UserProfile,
  Team,
  ProblemStatement,
  ProjectSubmission,
  NotificationItem,
  EventSettings,
  AuditLogItem,
  ProjectEvaluation,
} from "@/types";

interface ArtCodeData {
  users: UserProfile[];
  teams: Team[];
  challenges: ProblemStatement[];
  submissions: ProjectSubmission[];
  notifications: NotificationItem[];
  evaluations: ProjectEvaluation[];
  settings: EventSettings;
  auditLogs: AuditLogItem[];
  activeUserId: string; // for mock session switching
}

const DEFAULT_SETTINGS: EventSettings = {
  eventName: "ART//CODE 2026",
  tagline: "Where Creativity Meets Technology.",
  organiser: "DELTA — Data Science Department Association",
  institution: "Christ College of Engineering (Autonomous), Irinjalakuda",
  theme: "Art, Culture, Heritage & Creative Technology",
  registrationOpens: "2026-10-29T00:00:00+05:30",
  submissionOpens: "2026-10-30T00:00:00+05:30",
  submissionDeadline: "2026-11-08T23:59:59+05:30",
  winnerAnnouncement: "2026-11-14T18:00:00+05:30",
  teamSize: 2,
  firstPrize: "₹1,500",
  secondPrize: "₹1,000",
  thirdPrize: "₹500",
  totalPrizePool: "₹3,000",
  resultsPublished: false,
};

const DEFAULT_CHALLENGES: ProblemStatement[] = [
  {
    id: "ch-01",
    slug: "living-archives-mural-restoration",
    code: "CH-01",
    title: "Living Archives: Generative AI for Indigenous Mural & Fresco Restoration",
    category: "Heritage & AI",
    shortDescription: "Develop algorithmic neural inpainting and color palette synthesis to restore weathered temple frescoes while preserving sacred geometric proportions.",
    background: "Centuries-old Kerala and South Indian mural art forms are deteriorating due to humidity, age, and exposure. Traditional natural pigments (ochre, indigo, lime, lampblack) possess unique spectral properties rarely captured accurately by standard digital colorizers.",
    problemDescription: "Design a computer vision or generative pipeline that reconstructs damaged sections of heritage murals. The system must adhere to traditional iconometric canons (Dhyana Slokas and Talmana measurements) rather than generating unconstrained modern imagery.",
    objectives: [
      "Implement non-destructive digital inpainting of eroded fresco boundaries.",
      "Recreate authentic historical mineral and vegetal dye palettes based on historical pigments.",
      "Provide an interactive comparative viewer contrasting raw archives with restored states."
    ],
    expectedOutcomes: [
      "A functional prototype web or desktop tool for conservators and cultural historians.",
      "Clear visual attribution documentation demonstrating adherence to traditional artistic rules."
    ],
    constraints: [
      "Must not alter uncorrupted historical strokes.",
      "Must operate with low-resource training datasets typical of localized heritage."
    ],
    submissionGuidance: "Include raw sample inputs, restoration comparisons, architecture diagram, and GitHub repository.",
    accentColor: "terracotta",
    isPublished: true,
  },
  {
    id: "ch-02",
    slug: "symphony-of-mudras-classical-dance",
    code: "CH-02",
    title: "Symphony of Mudras: Real-time Computer Vision for Classical Dance Synthesis",
    category: "Performing Arts & Tech",
    shortDescription: "Capture, classify, and sonify classical Indian dance mudras (hand gestures) and footwork rhythms in real-time using pose estimation.",
    background: "Classical dance forms such as Kathakali, Bharatanatyam, and Mohiniyattam encode rich linguistic and rhythmic narratives through complex hand gestures (Hastas) and facial expressions (Navarasas).",
    problemDescription: "Build a multimodal creative experience that translates live or recorded performance gestures into dynamic visual particles, responsive kinetic typography, or generative generative soundscapes.",
    objectives: [
      "Achieve real-time classification of at least 15 primary Asamyutta and Samyutta Hastas.",
      "Generate aesthetic visual and auditory responses matching the emotional Bhavas.",
      "Offer educational feedback for students learning classical posture alignment."
    ],
    expectedOutcomes: [
      "An interactive web application operating via standard webcam without specialized hardware.",
      "Interactive tutorial mode visualizing skeletal joints and accuracy metrics."
    ],
    submissionGuidance: "Provide 3-5 minute demonstration video demonstrating gesture recognition and aesthetic feedback.",
    accentColor: "indigo",
    isPublished: true,
  },
  {
    id: "ch-03",
    slug: "kalam-and-code-dravidian-calligraphy",
    code: "CH-03",
    title: "Kalam & Code: Dynamic Typography Engine for Dravidian Calligraphy",
    category: "Indigenous Calligraphy",
    shortDescription: "Reimagine ancient palm-leaf scriptures and classical script ligatures as a modern responsive generative typography and vector system.",
    background: "Grantha, Vatteluttu, and archaic Malayalam scripts were historically incised using an iron stylus (Narayam) onto dried Palmyra leaves. The rounded curves evolved specifically to avoid tearing the leaf along its grain.",
    problemDescription: "Build an algorithmic font generator or vector layout engine that renders fluid, calligraphic letterforms responding to digital parameters (speed, stylus pressure, screen physics, or user interaction).",
    objectives: [
      "Mathematical modeling of the nib angle, pressure dynamics, and ink bleed physics.",
      "Support for complex conjunct consonants and historical ligature variants.",
      "Interactive digital exhibition showing the evolution from palm-leaf incision to generative code."
    ],
    expectedOutcomes: [
      "Exportable SVG/Canvas font or interactive digital canvas for contemporary designers.",
      "Educational narrative explaining the historical material constraints."
    ],
    submissionGuidance: "Link to interactive demo URL and GitHub repo with documented geometric curve calculations.",
    accentColor: "saffron",
    isPublished: true,
  },
  {
    id: "ch-04",
    slug: "woven-geometry-handloom-pattern-synthesis",
    code: "CH-04",
    title: "Woven Geometry: Algorithmic Loom & Pattern Synthesis for Traditional Handloom",
    category: "Digital Craftsmanship",
    shortDescription: "Translate mathematical fractals, cellular automata, and heritage weaving graphs into automated punch-card templates for weaver communities.",
    background: "Traditional handloom weaving (e.g. Kasavu borders, Balaramapuram weaves) utilizes binary warp/weft matrices that are direct historical precursors to modern computational punch cards.",
    problemDescription: "Develop an accessible digital design suite that bridges contemporary computational art algorithms with the practical warp/weft constraints of rural handloom weavers.",
    objectives: [
      "Interactive pattern designer generating cellular automata or fractal motifs.",
      "Automated conversion into real-world weave draft charts (lifting plans and tie-up matrices).",
      "Cost and yarn requirement estimator for artisan cooperatives."
    ],
    expectedOutcomes: [
      "Web-based pattern generator with instant exportable weaver draft sheets.",
      "Artisanal preview displaying high-resolution textile texture rendering."
    ],
    submissionGuidance: "Demonstrate the mathematical algorithm and generated weaver draft chart.",
    accentColor: "sage",
    isPublished: true,
  },
  {
    id: "ch-05",
    slug: "temple-of-resonance-spatial-heritage-exhibition",
    code: "CH-05",
    title: "Temple of Resonance: Spatial Audio & Interactive Web AR for Heritage Architecture",
    category: "Interactive Exhibitions",
    shortDescription: "Construct an immersive 3D/WebXR digital museum replicating the acoustic reverberation and tactile architecture of historic stone structures.",
    background: "Traditional South Indian temple halls feature musical stone pillars and specific acoustic geometry designed to amplify Vedic chanting and percussion resonance.",
    problemDescription: "Create a lightweight, browser-based WebXR or 3D interactive heritage exhibition allowing visitors to experience the acoustics, structural lighting, and cultural artifacts remotely.",
    objectives: [
      "Implement Web Audio API spatial acoustic impulse responses matching stone sanctuaries.",
      "Responsive 3D or WebGL architectural viewer optimized for mobile devices.",
      "Curated digital artifact hotspots with audio-visual narrative storytelling."
    ],
    expectedOutcomes: [
      "Performant 3D exhibition accessible without requiring app installation.",
      "Interactive acoustic resonance simulation when interacting with virtual architectural elements."
    ],
    submissionGuidance: "Submit hosted demo link and Google Drive walk-through video.",
    accentColor: "terracotta",
    isPublished: true,
  },
];

const DEFAULT_USERS: UserProfile[] = [
  {
    id: "user-admin",
    name: "Dr. Arun Mohan",
    email: "arun.mohan@cce.edu.in",
    phone: "+91 98471 23450",
    institution: "Christ College of Engineering, Irinjalakuda",
    department: "Data Science Association (DELTA)",
    yearOfStudy: "Faculty Lead",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    provider: "google",
    teamId: null,
    createdAt: "2026-10-25T10:00:00Z",
  },
  {
    id: "user-ananya",
    name: "Ananya Nair",
    email: "ananya.nair@cce.edu.in",
    phone: "+91 94471 89201",
    institution: "Christ College of Engineering, Irinjalakuda",
    department: "Computer Science & Engineering",
    yearOfStudy: "3rd Year",
    role: "leader",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    provider: "google",
    teamId: "team-kalakriti",
    createdAt: "2026-10-26T11:15:00Z",
  },
  {
    id: "user-rohan",
    name: "Rohan Varma",
    email: "rohan.varma@cce.edu.in",
    phone: "+91 98462 77103",
    institution: "Christ College of Engineering, Irinjalakuda",
    department: "Computer Science & Engineering",
    yearOfStudy: "3rd Year",
    role: "participant",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    provider: "github",
    teamId: "team-kalakriti",
    createdAt: "2026-10-26T14:30:00Z",
  },
  {
    id: "user-meera",
    name: "Meera Pillai",
    email: "meera.pillai@cce.edu.in",
    phone: "+91 97455 12099",
    institution: "Christ College of Engineering, Irinjalakuda",
    department: "Electronics & Communication",
    yearOfStudy: "2nd Year",
    role: "leader",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    provider: "google",
    teamId: "team-dhwani",
    createdAt: "2026-10-27T09:20:00Z",
  },
  {
    id: "user-siddharth",
    name: "Siddharth Menon",
    email: "siddharth.m@cce.edu.in",
    phone: "+91 96560 44321",
    institution: "Christ College of Engineering, Irinjalakuda",
    department: "Data Science",
    yearOfStudy: "4th Year",
    role: "participant",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    provider: "github",
    teamId: null,
    createdAt: "2026-10-28T08:45:00Z",
  },
];

const DEFAULT_TEAMS: Team[] = [
  {
    id: "team-kalakriti",
    name: "Team KalaKriti",
    leaderId: "user-ananya",
    invitationCode: "ART-4491",
    selectedChallengeId: "ch-01",
    status: "complete",
    members: [
      {
        userId: "user-ananya",
        name: "Ananya Nair",
        email: "ananya.nair@cce.edu.in",
        institution: "Christ College of Engineering, Irinjalakuda",
        department: "Computer Science & Engineering",
        role: "leader",
        joinedAt: "2026-10-26T11:15:00Z",
      },
      {
        userId: "user-rohan",
        name: "Rohan Varma",
        email: "rohan.varma@cce.edu.in",
        institution: "Christ College of Engineering, Irinjalakuda",
        department: "Computer Science & Engineering",
        role: "member",
        joinedAt: "2026-10-26T14:30:00Z",
      },
    ],
    createdAt: "2026-10-26T11:15:00Z",
  },
  {
    id: "team-dhwani",
    name: "Team Dhwani",
    leaderId: "user-meera",
    invitationCode: "ART-8823",
    selectedChallengeId: "ch-02",
    status: "incomplete",
    members: [
      {
        userId: "user-meera",
        name: "Meera Pillai",
        email: "meera.pillai@cce.edu.in",
        institution: "Christ College of Engineering, Irinjalakuda",
        department: "Electronics & Communication",
        role: "leader",
        joinedAt: "2026-10-27T09:20:00Z",
      },
    ],
    createdAt: "2026-10-27T09:20:00Z",
  },
];

const DEFAULT_SUBMISSIONS: ProjectSubmission[] = [
  {
    id: "sub-kalakriti",
    teamId: "team-kalakriti",
    teamName: "Team KalaKriti",
    challengeId: "ch-01",
    challengeTitle: "Living Archives: Generative AI for Indigenous Mural & Fresco Restoration",
    projectTitle: "ChitraPunar: Neural Fresco Inpainting with Mineral Pigment Physics",
    shortDescription: "An intelligent restoration pipeline synthesizing lost temple mural contours with authentic mineral pigments and Dhyana Sloka proportion safeguards.",
    problemDescription: "Historical temple frescoes across Kerala face severe dampness erosion. Traditional artists used vegetable dyes and stone powders that follow strict iconography guidelines, which modern diffusion models distort without cultural constraints.",
    proposedSolution: "We trained a lightweight edge-constrained latent inpainting network conditioned on classical Talmana ratio vectors. Our custom shaders simulate authentic vermilion, lampblack, and yellow ochre light scattering.",
    keyFeatures: [
      "Dual-stream latent inpainting respecting traditional iconographic line geometry",
      "Spectral simulation of 5 sacred Ayurvedic mineral pigments",
      "Interactive 4K dual-layer comparative web inspection tool",
      "Confidence heatmaps indicating restored vs. historically authentic strokes",
    ],
    techStack: ["Next.js", "PyTorch", "WebGL", "Tailwind CSS", "FastAPI"],
    innovationAndImpact: "Bridges centuries-old craftsmanship with modern non-destructive archival restoration, enabling regional heritage trusts to digitize endangered temple murals.",
    githubUrl: "https://github.com/kalakriti-artcode/chitrapunar",
    liveUrl: "https://chitrapunar.vercel.app",
    googleDriveUrl: "https://drive.google.com/drive/folders/artcode-kalakriti-sample-drive",
    additionalComments: "Demo video contains audio explanation in English and Malayalam.",
    status: "draft",
    referenceId: "AC26-SUB-4491",
    acknowledged: true,
    isLocked: false,
    updatedAt: "2026-10-28T16:00:00Z",
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "Welcome to ART//CODE 2026 Hackathon",
    message: "Welcome participants! Team registration is now active. Ensure your team has exactly 2 members to be eligible for submission.",
    priority: "important",
    targetAudience: "all",
    createdAt: "2026-10-26T09:00:00Z",
    readBy: ["user-ananya", "user-rohan"],
  },
  {
    id: "notif-02",
    title: "Project Submission Portal is Now Open",
    message: "The submission window is officially operational. Team leaders can draft project details, attach deliverables, and perform final locking once completed.",
    priority: "urgent",
    targetAudience: "all",
    createdAt: "2026-10-28T10:00:00Z",
    readBy: ["user-ananya"],
  },
  {
    id: "notif-03",
    title: "Reminder: Complete Your Team Formation",
    message: "Teams with only 1 member will not be permitted to submit projects. Share your 8-character invitation code to onboard your teammate.",
    priority: "normal",
    targetAudience: "incomplete_teams",
    createdAt: "2026-10-28T14:30:00Z",
    readBy: [],
  },
];

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-01",
    timestamp: "2026-10-26T09:00:00Z",
    actorName: "System",
    actorEmail: "system@cce.edu.in",
    action: "SYSTEM_INITIALIZED",
    details: "ART//CODE 2026 platform initialized with DELTA configurations.",
  },
  {
    id: "log-02",
    timestamp: "2026-10-26T11:15:00Z",
    actorName: "Ananya Nair",
    actorEmail: "ananya.nair@cce.edu.in",
    action: "TEAM_CREATED",
    details: "Team KalaKriti created with invite code ART-4491.",
  },
  {
    id: "log-03",
    timestamp: "2026-10-26T14:30:00Z",
    actorName: "Rohan Varma",
    actorEmail: "rohan.varma@cce.edu.in",
    action: "TEAM_JOINED",
    details: "Joined Team KalaKriti via invite code. Team status updated to complete.",
  },
];

const DB_FILE = path.join(process.cwd(), "data", "artcode_db.json");

function getInitialData(): ArtCodeData {
  return {
    users: DEFAULT_USERS,
    teams: DEFAULT_TEAMS,
    challenges: DEFAULT_CHALLENGES,
    submissions: DEFAULT_SUBMISSIONS,
    notifications: DEFAULT_NOTIFICATIONS,
    evaluations: [],
    settings: DEFAULT_SETTINGS,
    auditLogs: DEFAULT_AUDIT_LOGS,
    activeUserId: "user-ananya", // Default active demo user: Ananya (Team Leader)
  };
}

export function loadData(): ArtCodeData {
  try {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to read database file, initializing defaults:", error);
  }
  const initial = getInitialData();
  saveData(initial);
  return initial;
}

export function saveData(data: ArtCodeData): void {
  try {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save database file:", error);
  }
}

// Helper query & mutation methods
export function getActiveUser(): UserProfile | null {
  const data = loadData();
  return data.users.find((u) => u.id === data.activeUserId) || null;
}

export function setActiveUser(userId: string): UserProfile | null {
  const data = loadData();
  const user = data.users.find((u) => u.id === userId);
  if (user) {
    data.activeUserId = userId;
    saveData(data);
    return user;
  }
  return null;
}

export function getUserById(userId: string): UserProfile | null {
  const data = loadData();
  return data.users.find((u) => u.id === userId) || null;
}

export function getUserByEmail(email: string): UserProfile | null {
  const data = loadData();
  return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getTeamById(teamId: string): Team | null {
  const data = loadData();
  return data.teams.find((t) => t.id === teamId) || null;
}

export function getTeamByInviteCode(code: string): Team | null {
  const data = loadData();
  return data.teams.find((t) => t.invitationCode.toUpperCase() === code.trim().toUpperCase()) || null;
}

export function getChallenges(): ProblemStatement[] {
  const data = loadData();
  return data.challenges;
}

export function getChallengeById(id: string): ProblemStatement | null {
  const data = loadData();
  return data.challenges.find((c) => c.id === id || c.slug === id) || null;
}

export function getSubmissionByTeamId(teamId: string): ProjectSubmission | null {
  const data = loadData();
  return data.submissions.find((s) => s.teamId === teamId) || null;
}

export function getNotificationsForUser(userId: string): NotificationItem[] {
  const data = loadData();
  const user = data.users.find((u) => u.id === userId);
  if (!user) return data.notifications.filter((n) => n.targetAudience === "all");

  const team = user.teamId ? data.teams.find((t) => t.id === user.teamId) : null;
  const teamStatus = team?.status;

  return data.notifications.filter((n) => {
    if (n.targetAudience === "all") return true;
    if (n.targetAudience === "complete_teams" && teamStatus === "complete") return true;
    if (n.targetAudience === "incomplete_teams" && (!team || teamStatus === "incomplete")) return true;
    if (n.targetAudience === "specific_team" && n.targetTeamId === user.teamId) return true;
    return false;
  });
}

export function getEventSettings(): EventSettings {
  const data = loadData();
  return data.settings;
}

export function addAuditLog(actorName: string, actorEmail: string, action: string, details: string) {
  const data = loadData();
  const newLog: AuditLogItem = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName,
    actorEmail,
    action,
    details,
  };
  data.auditLogs.unshift(newLog);
  saveData(data);
}


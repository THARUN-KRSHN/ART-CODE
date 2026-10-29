import {
  AuditLogItem,
  EventSettings,
  NotificationAudience,
  NotificationItem,
  NotificationPriority,
  ProblemAccent,
  ProblemStatement,
  ProjectSubmission,
  SubmissionStatus,
  Team,
  TeamMember,
  TeamStatus,
  UserProfile,
  UserRole,
  WinnerResult,
} from "@/types";

export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  institution: string;
  department: string | null;
  year_of_study: string | null;
  role: "participant" | "admin";
  avatar_url: string | null;
  provider: string;
  team_id: string | null;
  created_at: string;
}

export interface TeamRow {
  id: string;
  name: string;
  leader_id: string;
  invitation_code: string;
  selected_challenge_id: string | null;
  status: TeamStatus;
  created_at: string;
}

export interface TeamMemberRow {
  user_id: string;
  team_id: string;
  role: "leader" | "member";
  joined_at: string;
  name?: string;
  email?: string;
  institution?: string;
  department?: string | null;
}

export interface ProblemRow {
  id: string;
  slug: string;
  code: string;
  title: string;
  category: string;
  domain: string;
  difficulty: string;
  motif: string;
  accent_color: string;
  short_description: string;
  background: string;
  problem_description: string;
  objectives: string[];
  expected_outcomes: string[];
  mvp: string;
  success_criteria: string;
  constraints: string[] | null;
  research_connection: string;
  submission_guidance: string;
  is_published: boolean;
}

export interface SubmissionRow {
  id: string;
  team_id: string;
  challenge_id: string;
  project_title: string;
  short_description: string;
  problem_description: string;
  proposed_solution: string;
  key_features: string[];
  tech_stack: string[];
  innovation_and_impact: string;
  github_url: string;
  live_url: string | null;
  google_drive_url: string;
  additional_comments: string | null;
  status: SubmissionStatus;
  reference_id: string | null;
  acknowledged: boolean;
  submitted_at: string | null;
  submitted_by: string | null;
  is_locked: boolean;
  updated_at: string;
  team_name?: string;
  challenge_title?: string;
}

export interface NotificationRow {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  target_audience: NotificationAudience;
  target_team_id: string | null;
  created_at: string;
}

export interface SettingsRow {
  id: number;
  event_name: string;
  tagline: string;
  organiser: string;
  institution: string;
  department: string;
  theme: string;
  registration_opens: string;
  submission_opens: string;
  submission_deadline: string;
  winner_announcement: string;
  team_size: number;
  first_prize: string;
  second_prize: string;
  third_prize: string;
  total_prize_pool: string;
  faculty_coordinators: string;
  student_coordinators: string;
  contact_email: string;
  results_published: boolean;
}

export interface WinnerRow {
  rank: 1 | 2 | 3;
  prize_amount: string;
  team_name: string;
  project_title: string;
  challenge_title: string;
  members: string[];
  institution: string;
  score: number;
}

export interface AuditRow {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_email: string;
  action: string;
  details: string;
}

export function mapProfile(row: ProfileRow, role: UserRole): UserProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    institution: row.institution,
    department: row.department || undefined,
    yearOfStudy: row.year_of_study || undefined,
    role,
    avatar: row.avatar_url,
    provider: (row.provider as UserProfile["provider"]) || "email",
    teamId: row.team_id,
    createdAt: row.created_at,
  };
}

export function mapTeam(team: TeamRow, members: TeamMemberRow[]): Team {
  return {
    id: team.id,
    name: team.name,
    leaderId: team.leader_id,
    invitationCode: team.invitation_code,
    selectedChallengeId: team.selected_challenge_id,
    status: team.status,
    members: members
      .slice()
      .sort((a, b) => (a.role === "leader" ? -1 : b.role === "leader" ? 1 : 0))
      .map(
        (m): TeamMember => ({
          userId: m.user_id,
          name: m.name || "",
          email: m.email || "",
          institution: m.institution || "",
          department: m.department || undefined,
          role: m.role,
          joinedAt: m.joined_at,
        })
      ),
    createdAt: team.created_at,
  };
}

export function mapProblem(row: ProblemRow): ProblemStatement {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    title: row.title,
    category: row.category,
    domain: row.domain,
    difficulty: row.difficulty,
    motif: row.motif,
    accentColor: (row.accent_color as ProblemAccent) || "vermilion",
    shortDescription: row.short_description,
    background: row.background,
    problemDescription: row.problem_description,
    objectives: row.objectives || [],
    expectedOutcomes: row.expected_outcomes || [],
    mvp: row.mvp || "",
    successCriteria: row.success_criteria || "",
    constraints: row.constraints || [],
    researchConnection: row.research_connection || "",
    submissionGuidance: row.submission_guidance || "",
    isPublished: row.is_published,
  };
}

export function mapSubmission(row: SubmissionRow, teamName?: string, challengeTitle?: string): ProjectSubmission {
  return {
    id: row.id,
    teamId: row.team_id,
    teamName: teamName || row.team_name || "",
    challengeId: row.challenge_id,
    challengeTitle: challengeTitle || row.challenge_title || "",
    projectTitle: row.project_title,
    shortDescription: row.short_description,
    problemDescription: row.problem_description,
    proposedSolution: row.proposed_solution,
    keyFeatures: row.key_features || [],
    techStack: row.tech_stack || [],
    innovationAndImpact: row.innovation_and_impact,
    githubUrl: row.github_url,
    liveUrl: row.live_url || undefined,
    googleDriveUrl: row.google_drive_url,
    additionalComments: row.additional_comments || undefined,
    status: row.status,
    referenceId: row.reference_id || undefined,
    acknowledged: row.acknowledged,
    submittedAt: row.submitted_at || undefined,
    submittedBy: row.submitted_by || undefined,
    isLocked: row.is_locked,
    updatedAt: row.updated_at,
  };
}

export function mapNotification(row: NotificationRow, readBy: string[] = []): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    priority: row.priority,
    targetAudience: row.target_audience,
    targetTeamId: row.target_team_id || undefined,
    createdAt: row.created_at,
    readBy,
  };
}

export function mapSettings(row: SettingsRow): EventSettings {
  return {
    eventName: row.event_name,
    tagline: row.tagline,
    organiser: row.organiser,
    institution: row.institution,
    department: row.department,
    theme: row.theme,
    registrationOpens: row.registration_opens,
    submissionOpens: row.submission_opens,
    submissionDeadline: row.submission_deadline,
    winnerAnnouncement: row.winner_announcement,
    teamSize: row.team_size,
    firstPrize: row.first_prize,
    secondPrize: row.second_prize,
    thirdPrize: row.third_prize,
    totalPrizePool: row.total_prize_pool,
    facultyCoordinators: row.faculty_coordinators,
    studentCoordinators: row.student_coordinators,
    contactEmail: row.contact_email,
    resultsPublished: row.results_published,
  };
}

export function mapWinner(row: WinnerRow): WinnerResult {
  return {
    rank: row.rank,
    prizeAmount: row.prize_amount,
    teamName: row.team_name,
    projectTitle: row.project_title,
    challengeTitle: row.challenge_title,
    members: row.members || [],
    institution: row.institution,
    score: Number(row.score),
  };
}

export function mapAudit(row: AuditRow): AuditLogItem {
  return {
    id: row.id,
    timestamp: row.timestamp,
    actorName: row.actor_name,
    actorEmail: row.actor_email,
    action: row.action,
    details: row.details,
  };
}

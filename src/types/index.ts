export type UserRole = "visitor" | "participant" | "leader" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  institution: string;
  department?: string;
  yearOfStudy?: string;
  role: UserRole;
  avatar?: string | null;
  provider: "google" | "github" | "email";
  teamId?: string | null;
  createdAt: string;
}

export type TeamStatus = "incomplete" | "complete";

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  institution: string;
  department?: string;
  role: "leader" | "member";
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  invitationCode: string;
  selectedChallengeId?: string | null;
  status: TeamStatus;
  members: TeamMember[];
  createdAt: string;
}

export type ProblemAccent = "vermilion" | "gold" | "darkRed" | "secondaryRed";

export interface ProblemStatement {
  id: string;
  slug: string;
  code: string;
  title: string;
  category: string;
  domain: string;
  difficulty: string;
  motif: string;
  accentColor: ProblemAccent;
  shortDescription: string;
  background: string;
  problemDescription: string;
  objectives: string[];
  expectedOutcomes: string[];
  mvp: string;
  successCriteria: string;
  constraints?: string[];
  researchConnection: string;
  submissionGuidance: string;
  isPublished: boolean;
}

export type SubmissionStatus = "draft" | "submitted" | "under_evaluation" | "evaluated";

export interface ProjectSubmission {
  id: string;
  teamId: string;
  teamName: string;
  challengeId: string;
  challengeTitle: string;
  projectTitle: string;
  shortDescription: string;
  problemDescription: string;
  proposedSolution: string;
  keyFeatures: string[];
  techStack: string[];
  innovationAndImpact: string;
  githubUrl: string;
  liveUrl?: string;
  googleDriveUrl: string;
  additionalComments?: string;
  status: SubmissionStatus;
  referenceId?: string;
  acknowledged: boolean;
  submittedAt?: string;
  submittedBy?: string;
  isLocked: boolean;
  updatedAt: string;
}

export type NotificationPriority = "normal" | "important" | "urgent";
export type NotificationAudience = "all" | "complete_teams" | "incomplete_teams" | "not_submitted" | "specific_team";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  targetAudience: NotificationAudience;
  targetTeamId?: string;
  createdAt: string;
  readBy: string[];
}

export interface EventSettings {
  eventName: string;
  tagline: string;
  organiser: string;
  institution: string;
  department: string;
  theme: string;
  registrationOpens: string;
  submissionOpens: string;
  submissionDeadline: string;
  winnerAnnouncement: string;
  teamSize: number;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
  totalPrizePool: string;
  facultyCoordinators: string;
  studentCoordinators: string;
  contactEmail: string;
  resultsPublished: boolean;
}

export interface WinnerResult {
  rank: 1 | 2 | 3;
  prizeAmount: string;
  teamName: string;
  projectTitle: string;
  challengeTitle: string;
  members: string[];
  institution: string;
  score: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  action: string;
  details: string;
}

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
  avatar?: string;
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

export type ChallengeCategory = 
  | "Heritage & AI"
  | "Digital Craftsmanship"
  | "Performing Arts & Tech"
  | "Interactive Exhibitions"
  | "Indigenous Calligraphy";

export interface ProblemStatement {
  id: string;
  slug: string;
  code: string; // e.g. "CH-01"
  title: string;
  category: ChallengeCategory;
  shortDescription: string;
  background: string;
  problemDescription: string;
  objectives: string[];
  expectedOutcomes: string[];
  constraints?: string[];
  submissionGuidance: string;
  accentColor: "terracotta" | "indigo" | "saffron" | "sage";
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
  referenceId?: string; // e.g. "AC26-SUB-8291"
  acknowledged: boolean;
  submittedAt?: string;
  submittedBy?: string; // Leader User ID
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
  readBy: string[]; // array of userIds
}

export interface EventSettings {
  eventName: string;
  tagline: string;
  organiser: string;
  institution: string;
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
  resultsPublished: boolean;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  maxMarks: number;
  score: number;
  guidance: string;
  comments?: string;
}

export interface ProjectEvaluation {
  id: string;
  submissionId: string;
  judgeName: string;
  judgeId: string;
  criteria: EvaluationCriterion[];
  totalScore: number;
  generalComments?: string;
  status: "draft" | "finalized";
  updatedAt: string;
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


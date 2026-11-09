export type FeedbackQuestionType = "rating" | "choice" | "text" | "textarea";

export type FeedbackPrefill = "name" | "institution" | "department" | "team";

export interface FeedbackQuestion {
  id: string;
  label: string;
  type: FeedbackQuestionType;
  required: boolean;
  help?: string;
  options?: string[];
  max?: number;
  placeholder?: string;
  rows?: number;
  prefill?: FeedbackPrefill;
}

export interface FeedbackSection {
  id: string;
  title: string;
  description?: string;
  note?: string;
  numbered: boolean;
  questions: FeedbackQuestion[];
}

export const RATING_SCALE = "1 – Poor | 2 – Satisfactory | 3 – Good | 4 – Very Good | 5 – Excellent";

export const FEEDBACK_SET_VERSION = "po4-v1";

export const FUTURE_OPTIONS = [
  "Definitely Yes",
  "Probably Yes",
  "Not Sure",
  "Probably No",
  "Definitely No",
];

export const FEEDBACK_SECTIONS: FeedbackSection[] = [
  {
    id: "details",
    title: "Section 1 — Participant Details",
    description: "Please provide your details for event feedback and documentation.",
    numbered: true,
    questions: [
      { id: "q_name", label: "Name of the Student", type: "text", required: true, prefill: "name" },
      { id: "q_college", label: "College / Institution", type: "text", required: true, prefill: "institution" },
      { id: "q_department", label: "Department", type: "text", required: true, prefill: "department" },
      { id: "q_semester", label: "Semester", type: "text", required: true, placeholder: "e.g. 5th Semester" },
      { id: "q_team", label: "Team Name", type: "text", required: true, prefill: "team" },
    ],
  },
  {
    id: "pos",
    title: "Section 2 — Program Outcome Assessment",
    description:
      "Rate your level of attainment of the following Program Outcomes through your participation in ART//CODE 2026.",
    note: RATING_SCALE,
    numbered: false,
    questions: [
      {
        id: "po2",
        label: "PO2 – Problem Analysis",
        type: "rating",
        required: true,
        max: 5,
        help: "The hackathon helped me analyse real-world challenges related to art, culture and heritage and identify suitable approaches to solve them.",
      },
      {
        id: "po3",
        label: "PO3 – Design and Development of Solutions",
        type: "rating",
        required: true,
        max: 5,
        help: "The hackathon helped me design and develop innovative technology-based solutions addressing challenges in art, culture and heritage.",
      },
      {
        id: "po5",
        label: "PO5 – Engineering Tool Usage",
        type: "rating",
        required: true,
        max: 5,
        help: "The hackathon enhanced my ability to use appropriate programming languages, frameworks and modern technological tools to develop my project.",
      },
      {
        id: "po8",
        label: "PO8 – Individual and Collaborative Teamwork",
        type: "rating",
        required: true,
        max: 5,
        help: "Working in a team improved my collaboration, task distribution and coordination towards achieving a common project goal.",
      },
    ],
  },
  {
    id: "event",
    title: "Section 3 — Event Feedback",
    description: "Use a 1–5 rating scale for the following.",
    note: RATING_SCALE,
    numbered: true,
    questions: [
      { id: "q_org", label: "How would you rate the overall organization of ART//CODE 2026?", type: "rating", required: true, max: 5 },
      { id: "q_statements", label: "How would you rate the relevance and quality of the problem statements?", type: "rating", required: true, max: 5 },
      { id: "q_platform", label: "How would you rate the registration and project submission platform?", type: "rating", required: true, max: 5 },
      { id: "q_guidelines", label: "How clear and effective were the event guidelines and instructions?", type: "rating", required: true, max: 5 },
      { id: "q_experience", label: "How satisfied are you with your overall hackathon experience?", type: "rating", required: true, max: 5 },
    ],
  },
  {
    id: "suggestions",
    title: "Section 4 — Suggestions & Future Scope",
    numbered: true,
    questions: [
      {
        id: "q_valuable",
        label: "Which aspect of ART//CODE did you find most valuable?",
        type: "textarea",
        required: false,
        rows: 3,
        placeholder: "Short answer or a few lines.",
      },
      {
        id: "q_difficulties",
        label: "What difficulties did you face during the event, particularly with registration, team formation or project submission?",
        type: "textarea",
        required: false,
        rows: 4,
        placeholder: "Describe any issues you ran into.",
      },
      {
        id: "q_improvements",
        label: "What improvements would you suggest for future DELTA hackathons?",
        type: "textarea",
        required: false,
        rows: 4,
        placeholder: "Your suggestions for the next edition.",
      },
      {
        id: "q_future",
        label: "Would you participate in future events organized by DELTA?",
        type: "choice",
        required: true,
        options: FUTURE_OPTIONS,
      },
    ],
  },
];

export const FEEDBACK_QUESTIONS: FeedbackQuestion[] = FEEDBACK_SECTIONS.flatMap(
  (section) => section.questions
);

export type FeedbackAnswers = Record<string, string | number>;

export function validateFeedbackAnswers(
  answers: unknown
): { ok: true; answers: FeedbackAnswers } | { ok: false; error: string } {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { ok: false, error: "Feedback answers are missing." };
  }

  const raw = answers as Record<string, unknown>;
  const clean: FeedbackAnswers = {};

  for (const q of FEEDBACK_QUESTIONS) {
    const value = raw[q.id];

    if (value === undefined || value === null || String(value).trim() === "") {
      if (q.required) return { ok: false, error: `Please answer: ${q.label}` };
      continue;
    }

    if (q.type === "rating") {
      const n = Number(value);
      const max = q.max || 5;
      if (!Number.isInteger(n) || n < 1 || n > max) {
        return { ok: false, error: `Please answer: ${q.label}` };
      }
      clean[q.id] = n;
      continue;
    }

    const text = String(value).trim();
    if (text.length > 2000) {
      return { ok: false, error: `An answer is too long (max 2000 characters).` };
    }
    if (q.type === "choice") {
      if (!q.options?.includes(text)) {
        return { ok: false, error: `Please answer: ${q.label}` };
      }
    }
    clean[q.id] = text;
  }

  return { ok: true, answers: clean };
}

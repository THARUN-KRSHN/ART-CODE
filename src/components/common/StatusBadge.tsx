import React from "react";

export type BadgeVariant =
  | "incomplete"
  | "complete"
  | "draft"
  | "ready"
  | "submitted"
  | "under_evaluation"
  | "results_published"
  | "neutral";

interface StatusBadgeProps {
  status: BadgeVariant | string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  let text = label;
  let styleClasses = "bg-ivory-200 text-ink-secondary border-border";

  switch (status) {
    case "incomplete":
      text = text || "Team Incomplete";
      styleClasses = "bg-saffron-50 text-saffron-600 border-saffron-200";
      break;
    case "complete":
      text = text || "Team Complete";
      styleClasses = "bg-sage-50 text-status-success border-sage-200";
      break;
    case "draft":
      text = text || "Draft in Progress";
      styleClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
      break;
    case "ready":
      text = text || "Ready to Submit";
      styleClasses = "bg-saffron-50 text-saffron-600 border-saffron-200";
      break;
    case "submitted":
      text = text || "Officially Submitted";
      styleClasses = "bg-sage-100 text-status-success border-sage-300 font-semibold";
      break;
    case "under_evaluation":
      text = text || "Under Evaluation";
      styleClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
      break;
    case "results_published":
      text = text || "Results Published";
      styleClasses = "bg-terracotta-50 text-terracotta border-terracotta-200";
      break;
    default:
      text = text || status;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide select-none ${styleClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {text}
    </span>
  );
}


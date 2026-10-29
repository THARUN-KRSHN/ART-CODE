import React from "react";
import { CheckCircle2, AlertTriangle, Lock, FileCode, Award, Shield } from "lucide-react";

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
  let styleClasses = "bg-paleCream text-ink border-mutedGold";
  let Icon = Shield;

  switch (status) {
    case "incomplete":
      text = text || "Team Incomplete (1/2)";
      styleClasses = "bg-accentGold/20 text-darkRed border-accentGold font-bold";
      Icon = AlertTriangle;
      break;
    case "complete":
      text = text || "Team Complete (2/2)";
      styleClasses = "bg-emerald-50 text-status-success border-emerald-300 font-bold";
      Icon = CheckCircle2;
      break;
    case "draft":
      text = text || "Draft Saved";
      styleClasses = "bg-paleCream text-secondaryRed border-mutedGold font-semibold";
      Icon = FileCode;
      break;
    case "ready":
      text = text || "Ready to Submit";
      styleClasses = "bg-accentGold/30 text-darkRed border-accentGold font-bold";
      Icon = CheckCircle2;
      break;
    case "submitted":
      text = text || "Officially Submitted & Locked";
      styleClasses = "bg-vermilion text-cream border-darkRed font-bold shadow-subtle";
      Icon = Lock;
      break;
    case "under_evaluation":
      text = text || "Under Evaluation";
      styleClasses = "bg-paleCream text-darkRed border-mutedGold font-semibold";
      Icon = Award;
      break;
    case "results_published":
      text = text || "Results Published";
      styleClasses = "bg-accentGold text-darkRed border-accentGold font-bold";
      Icon = Award;
      break;
    default:
      text = text || status;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border tracking-wider select-none ${styleClasses} ${className}`}
    >
      <Icon size={12} className="flex-shrink-0" />
      <span>{text}</span>
    </span>
  );
}

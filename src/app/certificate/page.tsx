"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Award, Loader2, Download, Printer, ArrowLeft, Lock } from "lucide-react";
import { CulturalDivider } from "@/components/art/CulturalMotifs";

type TeamOption = { id: string; name: string; projectTitle: string };

type CertificateData = {
  team: {
    id: string;
    name: string;
    members: { userId: string; name: string; role: string; institution: string; department: string }[];
    projectTitle: string;
    challengeTitle: string;
    referenceId: string;
    hasSubmission: boolean;
  };
};

const W = 1600;
const H = 1131;


const TEMPLATE_SRC = "/img/certificate-template.png";
const NAME_FONT_SIZE = 96.4;
const NAME_FONT_FAMILY = "Badhorse Display";
const NAME_COLOR = "#F0B40A";
const NAME_CENTER_X = 910;
const NAME_CENTER_Y = 633;
const NAME_MAX_WIDTH = 1250;

let templatePromise: Promise<HTMLImageElement | null> | null = null;

function loadTemplate(): Promise<HTMLImageElement | null> {
  if (!templatePromise) {
    templatePromise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = TEMPLATE_SRC;
    });
  }
  return templatePromise;
}

async function drawCertificate(
  ctx: CanvasRenderingContext2D,
  memberName: string
): Promise<void> {
  ctx.clearRect(0, 0, W, H);

  const template = await loadTemplate();
  if (template) {
    ctx.drawImage(template, 0, 0, W, H);
  } else {
    ctx.fillStyle = "#C0341D";
    ctx.fillRect(0, 0, W, H);
  }

  try {
    await document.fonts.load(`${NAME_FONT_SIZE}px "${NAME_FONT_FAMILY}"`, memberName);
  } catch {
    // Draw anyway; the canvas falls back if the font never arrives.
  }

  ctx.fillStyle = NAME_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `${NAME_FONT_SIZE}px "${NAME_FONT_FAMILY}"`;

  const measured = ctx.measureText(memberName).width;
  const size =
    measured > NAME_MAX_WIDTH ? NAME_FONT_SIZE * (NAME_MAX_WIDTH / measured) : NAME_FONT_SIZE;
  ctx.font = `${size}px "${NAME_FONT_FAMILY}"`;

  const metrics = ctx.measureText(memberName);
  const ascent = metrics.actualBoundingBoxAscent || size * 0.88;
  const descent = metrics.actualBoundingBoxDescent || 0;

  ctx.fillText(memberName, NAME_CENTER_X, NAME_CENTER_Y + (ascent - descent) / 2);
}

export default function CertificatePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [data, setData] = useState<CertificateData | null>(null);
  const [memberName, setMemberName] = useState("");
  const [blocked, setBlocked] = useState<{ opensAt: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Access gate: every signed-in user must submit feedback first,
  // then the availability window decides whether the generator unlocks.
  useEffect(() => {
    let cancelled = false;
    const preview =
      typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "1";

    (async () => {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json().catch(() => ({}));
        if (cancelled) return;

        if (!session?.user) {
          router.replace("/login?next=/certificate");
          return;
        }

        const fbRes = await fetch("/api/feedback");
        const fb = await fbRes.json().catch(() => ({}));
        if (cancelled) return;
        if (!fbRes.ok || !fb.submitted) {
          router.replace("/feedback?next=/certificate");
          return;
        }
      } catch {
        // Session probe failed; the availability API below still decides.
      }

      try {
        const res = await fetch(`/api/certificate${preview ? "?preview=1" : ""}`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || json.available === false) {
          setBlocked({
            opensAt: json.opensAt || "",
            message: json.error || "Certificates are not available yet.",
          });
          return;
        }
        setTeams(json.teams || []);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Load chosen team
  useEffect(() => {
    if (!selectedTeamId) {
      setData(null);
      setMemberName("");
      return;
    }
    setError(null);
    const preview =
      typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "1";
    fetch(
      `/api/certificate?teamId=${encodeURIComponent(selectedTeamId)}${preview ? "&preview=1" : ""}`
    )
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load team");
        setData({ team: json.team });
        setMemberName(json.team?.members?.[0]?.name || "");
      })
      .catch((e) => setError(e.message));
  }, [selectedTeamId]);

  // Render preview
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || !memberName) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawCertificate(ctx, memberName);
  }, [data, memberName]);

  useEffect(() => {
    render();
  }, [render]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safe = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `artcode-certificate-${safe(memberName)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const downloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const w = window.open("", "_blank");
    if (!w) {
      setError("Your browser blocked the print window. Allow pop-ups to export a PDF.");
      return;
    }
    w.document.write(
      `<!doctype html><html><head><title>ART//CODE Certificate</title>` +
        `<style>@page{size:A4 landscape;margin:0}html,body{margin:0;padding:0}` +
        `img{width:100%;height:auto;display:block}</style></head>` +
        `<body><img src="${dataUrl}" onload="window.focus();window.print();" /></body></html>`
    );
    w.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-vermilion mx-auto" />
          <p className="text-xs font-mono text-ink/70">Checking certificate availability...</p>
        </div>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="min-h-screen bg-cream bg-mandala-grid py-16 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-paleCream/95 p-8 sm:p-12 rounded-2xl border-2 border-mutedGold/60 shadow-elevated text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cream border-2 border-mutedGold/60 flex items-center justify-center text-vermilion mx-auto">
            <Lock size={30} />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              Certificates Locked
            </span>
            <h1 className="font-editorial text-3xl text-ink font-bold">Available from 10 November</h1>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed">
              {blocked.message} Certificates unlock once the event concludes, so that every team appears on
              the final roster.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase font-mono"
          >
            <ArrowLeft size={14} /> Back to event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream bg-mandala-grid py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-paleCream border-2 border-mutedGold/60 flex items-center justify-center text-vermilion">
              <Award size={22} />
            </div>
            <div>
              <h1 className="font-editorial text-2xl font-bold text-ink">Certificate Generator</h1>
              <p className="text-xs text-ink/70">Select your team and name to generate your certificate.</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-mono font-bold text-darkRed hover:text-vermilion inline-flex items-center gap-1.5"
          >
            <ArrowLeft size={13} /> Back
          </Link>
        </div>

        <CulturalDivider />

        {error && (
          <div className="p-4 rounded-xl border-2 border-vermilion/50 bg-vermilion/10 text-xs font-bold text-vermilion">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
          {/* Controls */}
          <div className="bg-paleCream p-5 rounded-2xl border-2 border-mutedGold/60 shadow-sm space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-darkRed mb-1">
                Team
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:outline-none focus:ring-1 focus:ring-vermilion"
              >
                <option value="">— Select your team —</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {teams.length === 0 && (
                <p className="text-[11px] text-ink/60 mt-1">No teams with submissions are listed yet.</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-darkRed mb-1">
                Name on certificate
              </label>
              <select
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                disabled={!data}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-mutedGold bg-cream text-ink focus:outline-none focus:ring-1 focus:ring-vermilion disabled:opacity-60"
              >
                {!data && <option value="">Select a team first</option>}
                {data?.team.members.map((m) => (
                  <option key={m.userId} value={m.name}>
                    {m.name} {m.role === "leader" ? "(Leader)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={downloadPng}
                disabled={!data || !memberName}
                className="w-full px-4 py-2.5 rounded-xl bg-vermilion text-cream text-xs font-bold uppercase tracking-wider hover:bg-darkRed inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download size={14} /> Download PNG
              </button>
              <button
                onClick={downloadPdf}
                disabled={!data || !memberName}
                className="w-full px-4 py-2.5 rounded-xl bg-darkRed text-cream text-xs font-bold uppercase tracking-wider hover:bg-vermilion inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Printer size={14} /> Save as PDF
              </button>
            </div>

            {data && (
              <div className="pt-2 border-t border-mutedGold/60 space-y-1 text-[11px] text-ink/70">
                <div>
                  Project: <strong className="text-ink">{data.team.projectTitle || "—"}</strong>
                </div>
                <div>
                  Track: <strong className="text-ink">{data.team.challengeTitle || "—"}</strong>
                </div>
                <div>
                  Ref: <strong className="text-ink font-mono">{data.team.referenceId || "—"}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-paleCream p-3 sm:p-4 rounded-2xl border-2 border-mutedGold/60 shadow-sm">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="w-full h-auto rounded-xl border border-mutedGold/40 bg-cream"
            />
            {!data && (
              <p className="text-center text-xs text-ink/60 py-3">
                Pick a team to preview your certificate.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

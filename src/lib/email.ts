import { headers } from "next/headers";

type EmailInput = {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

function siteBaseUrl(): string {
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") || h.get("host") || process.env.NEXT_PUBLIC_SITE_URL || "localhost:3000";
    const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  } catch {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    if (url) return url;
    return "http://localhost:3000";
  }
}

export async function sendEmail({ to, subject, html, text, from }: EmailInput): Promise<{ ok: boolean; id?: string; error?: string }>{
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddr = from || process.env.EMAIL_FROM || "ART CODE <no-reply@art-code.local>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — email will be logged only.");
    console.info(`[email] To: ${to.join(", ")}`);
    console.info(`[email] Subject: ${subject}`);
    console.info(`[email] HTML: ${html.substring(0, 500)}...`);
    return { ok: true, id: "log-only" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: fromAddr, to, subject, html, text }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend API ${res.status}: ${body}` };
    }
    const data = await res.json();
    return { ok: true, id: data?.id };
  } catch (e: any) {
    return { ok: false, error: e?.message || "email send failed" };
  }
}

export function renderBrandHeader(title: string): string {
  const base = siteBaseUrl();
  const logo = `${base}/img/logotype.png`;
  return `
  <div style="padding:16px 0;text-align:center">
    <img src="${logo}" alt="ART CODE" style="height:28px;opacity:.9"/>
    <div style="font:700 18px/1.3 ui-sans-serif,system-ui; color:#7E1E12; margin-top:10px">${title}</div>
  </div>`;
}

export function layoutEmail(inner: string): string {
  return `
  <div style="background:#fbf5e9;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#fff5e6;border:1px solid #e7c97a;border-radius:12px;padding:20px">
      ${inner}
      <hr style="border:none;border-top:1px solid #e7c97a;margin:16px 0"/>
      <div style="font:12px/1.5 ui-sans-serif,system-ui;color:#6b7280">
        This is an automated message from ART//CODE 2026.
      </div>
    </div>
  </div>`;
}

export function teamCreatedTemplate(teamName: string, inviteCode: string): { subject: string; html: string; text: string } {
  const subject = `Team created: ${teamName}`;
  const html = layoutEmail(
    renderBrandHeader("Team Created") +
      `<p style="font:14px/1.6 ui-sans-serif,system-ui;color:#111827">Your team <b>${teamName}</b> has been created successfully.</p>
       <p style="font:14px/1.6 ui-sans-serif,system-ui;color:#111827">Invitation code: <b>${inviteCode}</b></p>
       <p style="font:14px/1.6 ui-sans-serif,system-ui;color:#111827">Share this code with your partner so they can join and unlock the submission portal.</p>`
  );
  const text = `Team created: ${teamName}\nInvite code: ${inviteCode}`;
  return { subject, html, text };
}

export function submissionConfirmationTemplate(teamName: string, projectTitle: string, ref: string): { subject: string; html: string; text: string } {
  const subject = `Submission confirmed: ${projectTitle} (${ref})`;
  const html = layoutEmail(
    renderBrandHeader("Submission Confirmed") +
      `<p style="font:14px/1.6 ui-sans-serif,system-ui;color:#111827">Team <b>${teamName}</b> successfully submitted <b>${projectTitle}</b>.</p>
       <p style="font:14px/1.6 ui-sans-serif,system-ui;color:#111827">Reference ID: <b>${ref}</b></p>
       <p style="font:14px/1.6 ui-sans-serif,system-ui;color:#111827">You can view your confirmation page in the portal.</p>`
  );
  const text = `Submission confirmed\nTeam: ${teamName}\nProject: ${projectTitle}\nRef: ${ref}`;
  return { subject, html, text };
}

export function finalDayReminderTemplate(deadlineLocal: string): { subject: string; html: string; text: string } {
  const subject = `Final reminder: submissions close ${deadlineLocal}`;
  const html = layoutEmail(
    renderBrandHeader("Final Submission Reminder") +
      `<p style=\"font:14px/1.6 ui-sans-serif,system-ui;color:#111827\">This is a reminder that the ART//CODE 2026 submission window closes at <b>${deadlineLocal}</b>.</p>
       <p style=\"font:14px/1.6 ui-sans-serif,system-ui;color:#111827\">Ensure your draft is complete and locked before the deadline.</p>`
  );
  const text = `Final reminder: submissions close ${deadlineLocal}`;
  return { subject, html, text };
}

export function winnersAnnouncementTemplate(rank: number, teamName: string, projectTitle: string): { subject: string; html: string; text: string } {
  const subject = `Congratulations — ${rank === 1 ? "1st" : rank === 2 ? "2nd" : "3rd"} place!`;
  const html = layoutEmail(
    renderBrandHeader("Results — Top 3") +
      `<p style=\"font:14px/1.6 ui-sans-serif,system-ui;color:#111827\">Team <b>${teamName}</b> placed <b>${rank}</b> in ART//CODE 2026.</p>
       <p style=\"font:14px/1.6 ui-sans-serif,system-ui;color:#111827\">Project: <b>${projectTitle}</b></p>`
  );
  const text = `Congrats! Team ${teamName} placed ${rank}. Project: ${projectTitle}`;
  return { subject, html, text };
}

export const RegistrationOpens = new Date('2026-11-03T00:00:00+05:30');
export const SubmissionOpens = new Date('2026-11-06T00:00:00+05:30');
export const SubmissionDeadline = new Date('2026-11-10T23:59:59+05:30');
export const WinnerAnnouncement = new Date('2026-11-15T18:00:00+05:30');

export const fmt = (d: Date) =>
  d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

export const ScheduleISO = {
  registrationOpens: '2026-11-03T00:00:00+05:30',
  submissionOpens: '2026-11-06T00:00:00+05:30',
  submissionDeadline: '2026-11-10T23:59:59+05:30',
  winnerAnnouncement: '2026-11-15T18:00:00+05:30',
};
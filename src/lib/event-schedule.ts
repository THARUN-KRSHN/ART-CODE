export const RegistrationOpens = new Date('2026-11-03T00:00:00+05:30');
export const SubmissionOpens = new Date('2026-11-06T00:00:00+05:30');
// Submission closes on the 8th (IST)
export const SubmissionDeadline = new Date('2026-11-08T23:59:59+05:30');
// Top 8 teams announcement on the 9th (IST)
export const Top8Announcement = new Date('2026-11-09T18:00:00+05:30');
// Presentations on the 10th (IST) with resource person judge
export const PresentationDay = new Date('2026-11-10T10:00:00+05:30');
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
  // Closes on the 8th
  submissionDeadline: '2026-11-08T23:59:59+05:30',
  // Additional timeline milestones
  top8Announcement: '2026-11-09T18:00:00+05:30',
  presentationDay: '2026-11-10T10:00:00+05:30',
  winnerAnnouncement: '2026-11-15T18:00:00+05:30',
};

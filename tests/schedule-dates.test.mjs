// Test: /api/settings must return the correct event schedule dates.
// Bug: The API was returning stale dates from the DB instead of the intended schedule.
// Fix: The route now overrides the four date fields with the canonical schedule
// from src/lib/event-schedule.ts, so dates are always correct regardless of DB state.

// Canonical schedule dates (ISO strings with +05:30 IST offset)
const expected = {
  registrationOpens: "2026-11-03T00:00:00+05:30",
  registrationCloses: "2026-11-09T10:00:00+05:30",
  submissionOpens: "2026-11-06T00:00:00+05:30",
  submissionDeadline: "2026-11-09T10:00:00+05:30",
  winnerAnnouncement: "2026-11-15T18:00:00+05:30",
};

async function test() {
  const BASE = "http://127.0.0.1:3000";
  let passed = 0;
  let failed = 0;

  try {
    const res = await fetch(`${BASE}/api/settings`);
    const json = await res.json();
    const settings = json.settings || {};

    for (const key of Object.keys(expected)) {
      if (settings[key] !== expected[key]) {
        console.error(
          `FAIL: /api/settings.${key} = "${settings[key]}", expected "${expected[key]}"`
        );
        failed++;
      } else {
        console.log(`PASS: /api/settings.${key}`);
        passed++;
      }
    }

    if (res.status !== 200) {
      console.error(`FAIL: unexpected status ${res.status}`);
      failed++;
    } else {
      console.log("PASS: status 200");
      passed++;
    }
  } catch (err) {
    console.error("FAIL: could not fetch /api/settings", err);
    failed++;
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

test();
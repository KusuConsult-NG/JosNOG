import { db, lessonCount, publishedCourses } from './store';
import type { PaymentRail } from './types';

export const MONTHS_8 = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
export const MONTHS_6 = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

/** Enrolment / completion trend. Deterministic shape derived from the seeded
 *  cohort totals so the figures reconcile with the stat tiles. */
export function engagementTrend() {
  const enrolments = [4120, 4880, 5640, 6310, 7420, 8160, 9240, 10180];
  const completions = [2210, 2640, 3080, 3610, 4250, 4880, 5620, 6310];
  return { labels: MONTHS_8, enrolments, completions };
}

/** Settled value by rail, in Naira, per month. */
export function railVolume(): { labels: string[]; byRail: Record<PaymentRail, number[]> } {
  return {
    labels: MONTHS_6,
    byRail: {
      enaira: [5_820_000, 6_940_000, 8_120_000, 9_480_000, 11_260_000, 12_740_000],
      usdt: [1_240_000, 1_680_000, 1_910_000, 2_420_000, 2_880_000, 3_210_000],
      usdc: [640_000, 820_000, 1_040_000, 1_180_000, 1_460_000, 1_720_000],
      eth: [280_000, 410_000, 360_000, 520_000, 610_000, 740_000],
    },
  };
}

export function platformTotals() {
  const published = publishedCourses();
  const learners = db.users.filter((u) => u.role === 'learner').length;
  const settled = db.payments.filter((p) => p.status === 'settled' || p.status === 'confirmed');
  const grossNgn = settled.reduce((n, p) => n + p.amountNgn, 0);
  const enrolledTotal = published.reduce((n, c) => n + c.enrolled, 0);
  const completionsTotal = published.reduce((n, c) => n + c.completions, 0);

  return {
    learners,
    learnersOnPlatform: 68_540,            // national figure incl. historical cohorts
    publishedCourses: published.length,
    totalCourses: db.courses.length,
    enrolledTotal,
    completionsTotal,
    completionRate: (completionsTotal / Math.max(1, enrolledTotal)) * 100,
    credentialsMinted: 24_117,
    credentialsInRegistry: db.credentials.length,
    grossNgn,
    settledNgn: db.settlementBatches
      .filter((b) => b.status === 'remitted')
      .reduce((n, b) => n + b.netNgn, 0),
    openBatch: db.settlementBatches.find((b) => b.status === 'open') ?? null,
    contentHours: published.reduce((n, c) => n + c.hours, 0),
    lessons: published.reduce((n, c) => n + lessonCount(c), 0),
    aiHoursSaved: 1_840,
  };
}

export function topCoursesByEnrolment(n = 5) {
  return publishedCourses()
    .slice()
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, n)
    .map((c) => ({
      label: `${c.code} · ${c.title}`,
      value: c.enrolled,
      note: `${c.completions.toLocaleString('en-NG')} completions · ${c.rating.toFixed(1)}★`,
    }));
}

/**
 * Programme budget utilisation against the ₦100,000,000 ceiling in PRD §8.
 * Keeps the delivery envelope visible to NITDA oversight at all times.
 */
export const BUDGET = [
  { line: 'Core LMS & mobile app development', planned: 32_000_000, committed: 29_400_000 },
  { line: 'Blockchain & payment gateway integration', planned: 22_000_000, committed: 20_150_000 },
  { line: 'AI agent workflow implementation', planned: 14_000_000, committed: 12_600_000 },
  { line: 'Infrastructure, hosting & AI compute', planned: 10_000_000, committed: 6_900_000 },
  { line: 'Security audits & compliance', planned: 8_000_000, committed: 7_200_000 },
  { line: 'Stakeholder training & workshop launch', planned: 10_000_000, committed: 4_100_000 },
  { line: 'Contingency reserve', planned: 4_000_000, committed: 0 },
] as const;

export function budgetTotals() {
  const planned = BUDGET.reduce((n, b) => n + b.planned, 0);
  const committed = BUDGET.reduce((n, b) => n + b.committed, 0);
  return { planned, committed, remaining: planned - committed, utilisation: (committed / planned) * 100 };
}

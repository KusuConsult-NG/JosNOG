import {
  aiJobs, auditEvents, courses, credentials, DEMO_PASSWORD, enrollments,
  payments, SBT_CONTRACT, settlementBatches, users,
} from '@/data/seed';
import type {
  AiJob, AuditEvent, Course, Credential, Enrollment, Payment, SettlementBatch, User,
} from './types';

/**
 * Runtime data layer.
 *
 * The reference implementation keeps the seeded dataset in a process-level
 * singleton so the whole platform is demonstrable with zero infrastructure.
 * Every accessor below is the exact seam that the production adapters
 * (PostgreSQL via Prisma, Redis cache) implement — see docs/ARCHITECTURE.md.
 */
interface Db {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  payments: Payment[];
  settlementBatches: SettlementBatch[];
  credentials: Credential[];
  auditEvents: AuditEvent[];
  aiJobs: AiJob[];
}

const g = globalThis as unknown as { __etc_db?: Db };

function init(): Db {
  return {
    users: structuredClone(users),
    courses: structuredClone(courses),
    enrollments: structuredClone(enrollments),
    payments: structuredClone(payments),
    settlementBatches: structuredClone(settlementBatches),
    credentials: structuredClone(credentials),
    auditEvents: structuredClone(auditEvents),
    aiJobs: structuredClone(aiJobs),
  };
}

export const db: Db = (g.__etc_db ??= init());
export { DEMO_PASSWORD, SBT_CONTRACT };

/* ----------------------------- users ----------------------------- */

export const findUserByEmail = (email: string) =>
  db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

export const findUser = (id: string) => db.users.find((u) => u.id === id);

export function createUser(input: {
  name: string; email: string; password: string; mda: string; state: string;
  role?: User['role']; walletAddress?: string | null;
}): User {
  const user: User = {
    id: `usr_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    email: input.email.trim().toLowerCase(),
    password: input.password,
    role: input.role ?? 'learner',
    mda: input.mda,
    state: input.state,
    walletAddress: input.walletAddress ?? null,
    mfaEnabled: false,
    ndprConsentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 'active',
    lastSeen: new Date().toISOString(),
  };
  db.users.push(user);
  return user;
}

/* ---------------------------- courses ---------------------------- */

export const publishedCourses = () => db.courses.filter((c) => c.status === 'published');
export const findCourse = (id: string) => db.courses.find((c) => c.id === id);
export const findCourseByCode = (code: string) =>
  db.courses.find((c) => c.code.toLowerCase() === code.toLowerCase());

export const coursesAwaitingQa = () =>
  db.courses.filter((c) => c.status === 'in_qa' || c.status === 'changes_requested');

export const lessonCount = (c: Course) => c.modules.reduce((n, m) => n + m.lessons.length, 0);

/* -------------------------- enrollments -------------------------- */

export const enrollmentsFor = (userId: string) => db.enrollments.filter((e) => e.userId === userId);

export const enrollmentFor = (userId: string, courseId: string) =>
  db.enrollments.find((e) => e.userId === userId && e.courseId === courseId);

export function enroll(userId: string, courseId: string): Enrollment {
  const existing = enrollmentFor(userId, courseId);
  if (existing) return existing;
  const course = findCourse(courseId)!;
  const total = lessonCount(course);
  const e: Enrollment = {
    id: `enr_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    courseId,
    progressPct: 0,
    lessonsDone: 0,
    lessonsTotal: total,
    startedAt: new Date().toISOString(),
    completedAt: null,
    score: null,
    nextLesson: course.modules[0]?.lessons[0]?.title ?? 'Introduction',
    dueAt: null,
  };
  db.enrollments.push(e);
  course.enrolled += 1;
  return e;
}

/* ---------------------------- payments --------------------------- */

export const paymentsFor = (userId: string) =>
  db.payments.filter((p) => p.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const recentPayments = (n = 12) =>
  [...db.payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, n);

export function addPayment(p: Payment) {
  db.payments.unshift(p);
  return p;
}

export const findPaymentByReference = (reference: string) =>
  db.payments.find((p) => p.reference === reference);

/* --------------------------- credentials ------------------------- */

export const credentialsFor = (userId: string) =>
  db.credentials.filter((c) => c.userId === userId).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

export const findCredentialByCode = (code: string) =>
  db.credentials.find((c) => c.verificationCode.toLowerCase() === code.trim().toLowerCase());

export const findCredentialByTx = (tx: string) =>
  db.credentials.find((c) => c.txHash.toLowerCase() === tx.trim().toLowerCase());

export const findCredentialByTokenId = (tokenId: number) =>
  db.credentials.find((c) => c.tokenId === tokenId);

export function addCredential(c: Credential) {
  db.credentials.unshift(c);
  return c;
}

/* ------------------------------ audit ---------------------------- */

export function audit(e: Omit<AuditEvent, 'id' | 'ts'>) {
  const event: AuditEvent = {
    ...e,
    id: `aud_${Math.random().toString(36).slice(2, 8)}`,
    ts: new Date().toISOString(),
  };
  db.auditEvents.unshift(event);
  return event;
}

export const recentAudit = (n = 12) => db.auditEvents.slice(0, n);

/* ------------------------------ ai ------------------------------- */

export function addAiJob(j: AiJob) {
  db.aiJobs.unshift(j);
  return j;
}
export const recentAiJobs = (n = 8) => db.aiJobs.slice(0, n);

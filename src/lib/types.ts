/** Domain model for EduTrust-Chain. Mirrors docs/PRD.md §5 (Data Model). */

export type Role = 'learner' | 'instructor' | 'reviewer' | 'admin';

export const ROLE_LABEL: Record<Role, string> = {
  learner: 'Learner',
  instructor: 'Instructor',
  reviewer: 'QA Reviewer',
  admin: 'NITDA Administrator',
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;          // demo-only: replaced by Argon2id hashes in production (see PRD §6.1)
  role: Role;
  mda: string;               // Ministry / Department / Agency or partner institution
  state: string;
  walletAddress: string | null;
  mfaEnabled: boolean;
  ndprConsentAt: string | null;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending';
  lastSeen: string;
}

export type CourseStatus = 'draft' | 'in_qa' | 'changes_requested' | 'approved' | 'published' | 'archived';

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  kind: 'video' | 'reading' | 'lab' | 'quiz';
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface QaReport {
  plagiarismPct: number;
  toxicityPct: number;
  policyFlags: string[];
  readability: number;      // 0-100
  accessibility: number;    // 0-100
  checkedAt: string;
  verdict: 'pass' | 'review' | 'fail';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  summary: string;
  track: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced';
  hours: number;
  priceNgn: number;
  instructorId: string;
  status: CourseStatus;
  aiAssisted: boolean;
  modules: CourseModule[];
  qa: QaReport | null;
  enrolled: number;
  completions: number;
  rating: number;
  sbtEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPct: number;
  lessonsDone: number;
  lessonsTotal: number;
  startedAt: string;
  completedAt: string | null;
  score: number | null;
  nextLesson: string;
  dueAt: string | null;
}

export type PaymentRail = 'enaira' | 'usdt' | 'usdc' | 'eth';

export const RAIL_LABEL: Record<PaymentRail, string> = {
  enaira: 'eNaira (CBDC)',
  usdt: 'USDT',
  usdc: 'USDC',
  eth: 'ETH',
};

export type PaymentStatus = 'initiated' | 'awaiting_confirmation' | 'confirmed' | 'settled' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  reference: string;
  userId: string;
  courseId: string | null;
  rail: PaymentRail;
  amountNgn: number;
  tokenAmount: number | null;
  fxRateNgn: number | null;     // Chainlink NGN/USD feed snapshot
  oracleRound: string | null;
  status: PaymentStatus;
  txHash: string | null;
  settlementBatchId: string | null;
  createdAt: string;
  confirmations: number;
}

export interface SettlementBatch {
  id: string;
  rail: PaymentRail | 'mixed';
  openedAt: string;
  closedAt: string | null;
  grossNgn: number;
  feesNgn: number;
  netNgn: number;
  tsaAccount: string;
  reference: string;
  status: 'open' | 'reconciling' | 'remitted' | 'failed';
  slippagePct: number;
}

export interface Credential {
  id: string;
  tokenId: number;
  userId: string;
  courseId: string;
  chain: 'Polygon PoS' | 'Polygon Amoy' | 'Arbitrum One';
  contract: string;
  standard: 'ERC-721 (Soulbound)' | 'ERC-1155 (Soulbound)';
  txHash: string;
  blockNumber: number;
  metadataUri: string;       // ipfs://...
  issuedAt: string;
  grade: string;
  score: number;
  verificationCode: string;  // printed on the certificate + QR payload
  revoked: boolean;
  revokedReason: string | null;
}

export interface AuditEvent {
  id: string;
  ts: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  ip: string;
  severity: 'info' | 'notice' | 'warning' | 'critical';
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  at: string;
  citations?: string[];
}

export interface AiJob {
  id: string;
  kind: 'syllabus' | 'quiz' | 'notes' | 'grading' | 'moderation';
  prompt: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  model: string;
  tokensIn: number;
  tokensOut: number;
  costNgn: number;
  createdAt: string;
  courseId: string | null;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  mda: string;
  walletAddress: string | null;
}

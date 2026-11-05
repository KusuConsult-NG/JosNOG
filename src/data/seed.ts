import type {
  AiJob, AuditEvent, Course, CourseModule, Credential, Enrollment,
  Payment, PaymentRail, SettlementBatch, User,
} from '@/lib/types';
import { daysAgo, daysAhead, hex, intBetween, mulberry32, pick } from './rng';

const rand = mulberry32(20261105);

export const DEMO_PASSWORD = 'Nitda@2026';

const STATES = ['FCT Abuja', 'Lagos', 'Plateau', 'Kano', 'Rivers', 'Enugu', 'Kaduna', 'Oyo', 'Borno', 'Cross River'];
const MDAS = [
  'NITDA HQ, Abuja', 'Federal Ministry of Communications, Innovation & Digital Economy',
  'NIMC', 'NCC', 'Galaxy Backbone', 'NIGCOMSAT', 'Federal Ministry of Education',
  'Plateau State Ministry of Science & Technology', 'NITDA Jos Office', 'NDPC',
];

export const users: User[] = [
  {
    id: 'usr_admin_01', name: 'Aisha Bello', email: 'admin@nitda.gov.ng', password: DEMO_PASSWORD,
    role: 'admin', mda: 'NITDA HQ, Abuja', state: 'FCT Abuja',
    walletAddress: '0x7A3f91C4E2bD5a6F08c1B4d7E9a2C5f8B1d0E3a6',
    mfaEnabled: true, ndprConsentAt: daysAgo(212), createdAt: daysAgo(212),
    status: 'active', lastSeen: daysAgo(0, 8),
  },
  {
    id: 'usr_learner_01', name: 'Chinedu Okafor', email: 'learner@nitda.gov.ng', password: DEMO_PASSWORD,
    role: 'learner', mda: 'NITDA Jos Office', state: 'Plateau',
    walletAddress: '0x4D9a2C5f8B1d0E3a67A3f91C4E2bD5a6F08c1B4d',
    mfaEnabled: true, ndprConsentAt: daysAgo(96), createdAt: daysAgo(96),
    status: 'active', lastSeen: daysAgo(0, 9),
  },
  {
    id: 'usr_instr_01', name: 'Dr. Fatima Yusuf', email: 'instructor@nitda.gov.ng', password: DEMO_PASSWORD,
    role: 'instructor', mda: 'NITDA HQ, Abuja', state: 'FCT Abuja',
    walletAddress: '0x1B4d7E9a2C5f8B1d0E3a67A3f91C4E2bD5a6F08c',
    mfaEnabled: true, ndprConsentAt: daysAgo(180), createdAt: daysAgo(180),
    status: 'active', lastSeen: daysAgo(1, 16),
  },
  {
    id: 'usr_rev_01', name: 'Emeka Nwosu', email: 'reviewer@nitda.gov.ng', password: DEMO_PASSWORD,
    role: 'reviewer', mda: 'NITDA HQ, Abuja', state: 'FCT Abuja',
    walletAddress: null, mfaEnabled: true, ndprConsentAt: daysAgo(150), createdAt: daysAgo(150),
    status: 'active', lastSeen: daysAgo(0, 7),
  },
];

const EXTRA_NAMES = [
  'Hauwa Ibrahim', 'Tunde Adeyemi', 'Ngozi Eze', 'Musa Danjuma', 'Blessing Agbo',
  'Yakubu Shehu', 'Chiamaka Obi', 'Ifeanyi Uche', 'Zainab Lawal', 'Segun Balogun',
  'Amina Suleiman', 'Peter Gyang', 'Rukayat Adebayo', 'Daniel Longdet', 'Halima Garba',
  'Oluwaseun Ajayi', 'Bashir Mohammed', 'Grace Dalyop',
];

EXTRA_NAMES.forEach((name, i) => {
  const role = i % 7 === 0 ? 'instructor' : 'learner';
  users.push({
    id: `usr_${String(i + 10).padStart(3, '0')}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@${pick(rand, ['nitda.gov.ng', 'edu.ng', 'gov.ng'])}`,
    password: DEMO_PASSWORD,
    role,
    mda: pick(rand, MDAS),
    state: pick(rand, STATES),
    walletAddress: rand() > 0.25 ? hex(rand, 20) : null,
    mfaEnabled: rand() > 0.3,
    ndprConsentAt: daysAgo(intBetween(rand, 5, 160)),
    createdAt: daysAgo(intBetween(rand, 5, 160)),
    status: i === 5 ? 'suspended' : i === 11 ? 'pending' : 'active',
    lastSeen: daysAgo(intBetween(rand, 0, 14), intBetween(rand, 7, 20)),
  });
});

function modules(defs: [string, [string, number, CourseModule['lessons'][number]['kind']][]][], cid: string): CourseModule[] {
  return defs.map(([title, lessons], mi) => ({
    id: `${cid}-m${mi + 1}`,
    title,
    lessons: lessons.map(([lt, min, kind], li) => ({ id: `${cid}-m${mi + 1}-l${li + 1}`, title: lt, minutes: min, kind })),
  }));
}

interface CourseSeed {
  code: string; title: string; summary: string; track: string;
  level: Course['level']; hours: number; priceNgn: number; instructorId: string;
  status: Course['status']; aiAssisted: boolean; enrolled: number; completions: number; rating: number;
  mods: [string, [string, number, CourseModule['lessons'][number]['kind']][]][];
}

const COURSE_SEEDS: CourseSeed[] = [
  {
    code: 'ETC-101', title: 'Foundations of Blockchain for the Public Sector',
    summary: 'How distributed ledgers work, where they fit in government service delivery, and how Nigeria’s National Blockchain Policy is being operationalised across MDAs.',
    track: 'Blockchain & Digital Currency', level: 'Foundation', hours: 18, priceNgn: 25000,
    instructorId: 'usr_instr_01', status: 'published', aiAssisted: true,
    enrolled: 8421, completions: 5190, rating: 4.7,
    mods: [
      ['Distributed Ledger Primer', [['What a blockchain actually is', 14, 'video'], ['Consensus: PoW, PoS and PoA', 18, 'video'], ['Public, private and consortium chains', 12, 'reading'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['Nigeria’s National Blockchain Policy', [['Policy pillars and governance', 16, 'video'], ['The 2023–2030 implementation roadmap', 13, 'reading'], ['MDA adoption case studies', 15, 'video'], ['Module 2 knowledge check', 10, 'quiz']]],
      ['Government Use Cases', [['Land registry and title records', 17, 'video'], ['Academic credential verification', 14, 'video'], ['Supply chain and procurement trails', 15, 'reading'], ['Design lab: pick an MDA process', 45, 'lab']]],
      ['Risk, Law & Ethics', [['Regulatory landscape: CBN, SEC, NDPC', 18, 'video'], ['Data protection on immutable ledgers', 16, 'reading'], ['Final assessment', 30, 'quiz']]],
    ],
  },
  {
    code: 'ETC-102', title: 'eNaira & CBDC Payment Systems',
    summary: 'Hands-on with the Central Bank of Nigeria eNaira stack: wallet tiers, merchant onboarding, QR acceptance, settlement into the Treasury Single Account, and reconciliation controls.',
    track: 'Blockchain & Digital Currency', level: 'Intermediate', hours: 22, priceNgn: 35000,
    instructorId: 'usr_instr_01', status: 'published', aiAssisted: true,
    enrolled: 6134, completions: 3402, rating: 4.8,
    mods: [
      ['CBDC Fundamentals', [['Why central banks issue digital currency', 15, 'video'], ['eNaira architecture and wallet tiers', 19, 'video'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['Merchant Integration', [['Registering an eNaira merchant profile', 14, 'video'], ['QR code acceptance flows', 16, 'lab'], ['Webhooks, callbacks and idempotency', 20, 'lab'], ['Module 2 knowledge check', 10, 'quiz']]],
      ['Settlement & Reconciliation', [['TSA remittance and T+0 settlement', 18, 'video'], ['Three-way reconciliation controls', 17, 'reading'], ['Dispute handling and chargebacks', 14, 'video'], ['Final assessment', 30, 'quiz']]],
    ],
  },
  {
    code: 'ETC-201', title: 'Smart Contract Development with Solidity',
    summary: 'Write, test, audit and deploy production Solidity on Ethereum Layer-2. Includes the soulbound credential pattern used by EduTrust-Chain itself.',
    track: 'Blockchain & Digital Currency', level: 'Advanced', hours: 40, priceNgn: 75000,
    instructorId: 'usr_instr_01', status: 'published', aiAssisted: false,
    enrolled: 2908, completions: 1211, rating: 4.6,
    mods: [
      ['Solidity Essentials', [['Types, storage and gas', 22, 'video'], ['Functions, modifiers, events', 20, 'video'], ['Lab: your first contract', 60, 'lab'], ['Module 1 knowledge check', 12, 'quiz']]],
      ['Token Standards', [['ERC-20, ERC-721, ERC-1155', 24, 'video'], ['Soulbound tokens: non-transferability', 18, 'video'], ['Lab: mint a soulbound certificate', 75, 'lab']]],
      ['Security & Audit', [['Reentrancy, overflow, access control', 26, 'video'], ['Slither, Foundry fuzzing and invariants', 28, 'lab'], ['Writing an audit response', 15, 'reading'], ['Final assessment', 40, 'quiz']]],
      ['Layer-2 Deployment', [['Polygon and Arbitrum deployment', 20, 'lab'], ['Gas sponsorship and paymasters', 18, 'video'], ['Capstone project', 120, 'lab']]],
    ],
  },
  {
    code: 'ETC-210', title: 'Nigeria Data Protection Act Compliance Essentials',
    summary: 'The NDPA 2023 and NDPR in practice: lawful bases, data subject rights, DPIAs, cross-border transfer, breach notification and NDPC audit readiness for MDAs.',
    track: 'Policy & Compliance', level: 'Intermediate', hours: 16, priceNgn: 30000,
    instructorId: 'usr_017', status: 'published', aiAssisted: true,
    enrolled: 5277, completions: 3988, rating: 4.9,
    mods: [
      ['Legal Foundations', [['NDPA 2023 scope and definitions', 16, 'video'], ['Lawful bases for processing', 14, 'video'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['Operational Compliance', [['Running a DPIA', 20, 'lab'], ['Data subject access requests', 15, 'video'], ['Cross-border transfer rules', 13, 'reading']]],
      ['Incidents & Audit', [['72-hour breach notification', 14, 'video'], ['NDPC audit evidence pack', 16, 'reading'], ['Final assessment', 25, 'quiz']]],
    ],
  },
  {
    code: 'ETC-301', title: 'Applied AI & Machine Learning for Government Services',
    summary: 'Build and govern AI services for the public sector — from use-case triage and data readiness to model evaluation, bias testing and the NITDA AI governance framework.',
    track: 'AI & Data', level: 'Advanced', hours: 36, priceNgn: 65000,
    instructorId: 'usr_017', status: 'published', aiAssisted: true,
    enrolled: 4012, completions: 1740, rating: 4.5,
    mods: [
      ['AI Use-Case Triage', [['Where AI helps, where it harms', 18, 'video'], ['Data readiness assessment', 16, 'lab'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['Building Models', [['Classical ML baselines', 24, 'video'], ['Working with large language models', 26, 'video'], ['Lab: a citizen-services assistant', 90, 'lab']]],
      ['Governance & Assurance', [['Bias, fairness and evaluation', 22, 'video'], ['NITDA AI governance framework', 18, 'reading'], ['Final assessment', 35, 'quiz']]],
    ],
  },
  {
    code: 'ETC-150', title: 'Cybersecurity Fundamentals for MDAs',
    summary: 'Baseline cyber hygiene and incident response for federal and state agencies, mapped to the NITDA cybersecurity guidelines and ISO/IEC 27001 controls.',
    track: 'Cybersecurity', level: 'Foundation', hours: 20, priceNgn: 28000,
    instructorId: 'usr_010', status: 'published', aiAssisted: true,
    enrolled: 7620, completions: 5102, rating: 4.6,
    mods: [
      ['Threat Landscape', [['Attacker tradecraft in 2026', 16, 'video'], ['Phishing and business email compromise', 14, 'video'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['Core Controls', [['Identity, MFA and least privilege', 18, 'video'], ['Patch and vulnerability management', 15, 'reading'], ['Lab: hardening a workstation fleet', 50, 'lab']]],
      ['Incident Response', [['Detect, contain, eradicate, recover', 20, 'video'], ['Reporting to ngCERT', 12, 'reading'], ['Final assessment', 25, 'quiz']]],
    ],
  },
  {
    code: 'ETC-120', title: 'Digital Literacy & Workplace Productivity',
    summary: 'The entry-level pathway of the National Digital Literacy Framework — devices, documents, collaboration, safe browsing and digital citizenship.',
    track: 'Digital Literacy', level: 'Foundation', hours: 12, priceNgn: 0,
    instructorId: 'usr_010', status: 'published', aiAssisted: true,
    enrolled: 19430, completions: 14882, rating: 4.4,
    mods: [
      ['Getting Started', [['Devices, files and folders', 12, 'video'], ['Staying safe online', 14, 'video'], ['Module 1 knowledge check', 8, 'quiz']]],
      ['Working Digitally', [['Documents and spreadsheets', 16, 'video'], ['Email and collaboration etiquette', 12, 'reading'], ['Final assessment', 20, 'quiz']]],
    ],
  },
  {
    code: 'ETC-160', title: 'ICT Project Management for Government Delivery',
    summary: 'Plan, govern and land technology projects in the Nigerian public sector — business cases, procurement rules, agile delivery and benefits realisation.',
    track: 'Policy & Compliance', level: 'Foundation', hours: 20, priceNgn: 22000,
    instructorId: 'usr_010', status: 'published', aiAssisted: true,
    enrolled: 6845, completions: 4620, rating: 4.5,
    mods: [
      ['Framing the Project', [['Business cases that survive scrutiny', 16, 'video'], ['Public procurement essentials', 15, 'reading'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['Delivering', [['Agile in a governance-heavy setting', 18, 'video'], ['Risk, issue and dependency control', 16, 'lab'], ['Module 2 knowledge check', 10, 'quiz']]],
      ['Landing the Benefits', [['Benefits realisation and handover', 15, 'video'], ['Post-implementation review', 12, 'reading'], ['Final assessment', 25, 'quiz']]],
    ],
  },
  {
    code: 'ETC-310', title: 'National Digital Economy Policy & Strategy in Practice',
    summary: 'The eight pillars of NDEPS and the Strategic Roadmap and Action Plan — how MDAs translate national digital policy into funded, measurable programmes.',
    track: 'Policy & Compliance', level: 'Advanced', hours: 24, priceNgn: 38000,
    instructorId: 'usr_017', status: 'published', aiAssisted: true,
    enrolled: 3188, completions: 1902, rating: 4.6,
    mods: [
      ['The Policy Architecture', [['The eight NDEPS pillars', 18, 'video'], ['SRAP and the delivery machinery', 16, 'reading'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['From Policy to Programme', [['Writing a fundable digital programme', 20, 'lab'], ['Measuring digital economy outcomes', 17, 'video'], ['Module 2 knowledge check', 10, 'quiz']]],
      ['Accountability', [['Reporting to the Ministry and NASS', 15, 'video'], ['Final assessment', 30, 'quiz']]],
    ],
  },
  {
    code: 'ETC-140', title: 'Emerging Technologies for Public Service Delivery',
    summary: 'A guided tour of IoT, drones, digital twins and immersive technology, with the NITDA adoption gates each must pass before entering a government service.',
    track: 'Cloud & Infrastructure', level: 'Foundation', hours: 14, priceNgn: 18000,
    instructorId: 'usr_010', status: 'published', aiAssisted: true,
    enrolled: 4517, completions: 2840, rating: 4.3,
    mods: [
      ['The Technology Set', [['IoT and sensor networks', 14, 'video'], ['Drones and geospatial services', 13, 'video'], ['Digital twins and simulation', 12, 'reading'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['Adoption Gates', [['Readiness, cost and risk screening', 16, 'video'], ['Procuring emerging technology safely', 14, 'reading'], ['Final assessment', 22, 'quiz']]],
    ],
  },
  {
    code: 'ETC-230', title: 'Web3 Wallets, Custody & VASP Compliance',
    summary: 'Key management, custody models and the SEC Nigeria VASP regime — AML/CFT obligations, travel rule, and compliant stablecoin acceptance for institutions.',
    track: 'Blockchain & Digital Currency', level: 'Intermediate', hours: 24, priceNgn: 45000,
    instructorId: 'usr_instr_01', status: 'in_qa', aiAssisted: true,
    enrolled: 0, completions: 0, rating: 0,
    mods: [
      ['Key Management', [['Seed phrases, HD wallets, hardware keys', 18, 'video'], ['Multisig and MPC custody', 20, 'video'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['VASP Regulation', [['SEC Nigeria digital asset rules', 17, 'video'], ['AML/CFT and the travel rule', 19, 'reading'], ['Lab: stablecoin acceptance controls', 60, 'lab'], ['Final assessment', 30, 'quiz']]],
    ],
  },
  {
    code: 'ETC-240', title: 'Data Analytics for Policy Decision-Making',
    summary: 'Turn administrative data into policy evidence: cleaning, indicators, visual design and the open-data publication standard for Nigerian MDAs.',
    track: 'AI & Data', level: 'Intermediate', hours: 26, priceNgn: 40000,
    instructorId: 'usr_017', status: 'changes_requested', aiAssisted: true,
    enrolled: 0, completions: 0, rating: 0,
    mods: [
      ['Data Foundations', [['Sources of administrative data', 15, 'video'], ['Cleaning and validation', 20, 'lab'], ['Module 1 knowledge check', 10, 'quiz']]],
      ['From Data to Decision', [['Designing indicators', 18, 'video'], ['Visual communication for ministers', 16, 'video'], ['Final assessment', 25, 'quiz']]],
    ],
  },
  {
    code: 'ETC-220', title: 'Cloud Infrastructure & DevOps for Public Services',
    summary: 'Design, deploy and operate resilient government workloads using the Nigeria Cloud Computing Policy, with CI/CD, observability and cost governance.',
    track: 'Cloud & Infrastructure', level: 'Intermediate', hours: 30, priceNgn: 50000,
    instructorId: 'usr_010', status: 'draft', aiAssisted: true,
    enrolled: 0, completions: 0, rating: 0,
    mods: [
      ['Cloud Foundations', [['Service models and the NCCP', 16, 'video'], ['Landing zones and tenancy', 18, 'video']]],
      ['Delivery & Operations', [['CI/CD pipelines', 20, 'lab'], ['Observability and SLOs', 18, 'video']]],
    ],
  },
];

export const courses: Course[] = COURSE_SEEDS.map((s, i) => {
  const id = `crs_${s.code.toLowerCase().replace('-', '')}`;
  const qaNeeded = s.status !== 'draft';
  return {
    id,
    code: s.code,
    title: s.title,
    summary: s.summary,
    track: s.track,
    level: s.level,
    hours: s.hours,
    priceNgn: s.priceNgn,
    instructorId: s.instructorId,
    status: s.status,
    aiAssisted: s.aiAssisted,
    modules: modules(s.mods, id),
    qa: qaNeeded
      ? {
          plagiarismPct: s.status === 'changes_requested' ? 14.2 : Number((rand() * 3.4 + 0.4).toFixed(1)),
          toxicityPct: Number((rand() * 0.6).toFixed(2)),
          policyFlags: s.status === 'changes_requested'
            ? ['Uncited figure in Module 2 (slide 14)', 'Missing alt text on 6 images']
            : [],
          readability: intBetween(rand, 64, 86),
          accessibility: s.status === 'changes_requested' ? 71 : intBetween(rand, 88, 98),
          checkedAt: daysAgo(intBetween(rand, 1, 20)),
          verdict: s.status === 'changes_requested' ? 'review' : 'pass',
        }
      : null,
    enrolled: s.enrolled,
    completions: s.completions,
    rating: s.rating,
    sbtEnabled: s.status === 'published',
    createdAt: daysAgo(150 - i * 9),
    updatedAt: daysAgo(intBetween(rand, 0, 12)),
  };
});

export const courseById = (id: string) => courses.find((c) => c.id === id);
export const courseByCode = (code: string) => courses.find((c) => c.code.toLowerCase() === code.toLowerCase());

/* ------------------------------------------------------------------ */
/* Enrollments for the demo learner                                    */
/* ------------------------------------------------------------------ */

function enrollment(userId: string, code: string, progressPct: number, opts: Partial<Enrollment> = {}): Enrollment {
  const c = courseByCode(code)!;
  const total = c.modules.reduce((n, m) => n + m.lessons.length, 0);
  const done = Math.round((progressPct / 100) * total);
  const flat = c.modules.flatMap((m) => m.lessons);
  return {
    id: `enr_${userId.slice(-2)}_${c.code.toLowerCase().replace('-', '')}`,
    userId,
    courseId: c.id,
    progressPct,
    lessonsDone: done,
    lessonsTotal: total,
    startedAt: daysAgo(intBetween(rand, 20, 80)),
    completedAt: progressPct === 100 ? daysAgo(intBetween(rand, 2, 18)) : null,
    score: progressPct === 100 ? intBetween(rand, 72, 96) : null,
    nextLesson: flat[Math.min(done, flat.length - 1)]?.title ?? 'Course complete',
    dueAt: progressPct === 100 ? null : daysAhead(intBetween(rand, 3, 24)),
    ...opts,
  };
}

export const enrollments: Enrollment[] = [
  enrollment('usr_learner_01', 'ETC-102', 68),
  enrollment('usr_learner_01', 'ETC-201', 34),
  enrollment('usr_learner_01', 'ETC-101', 100),
  enrollment('usr_learner_01', 'ETC-150', 100),
  enrollment('usr_learner_01', 'ETC-210', 12),
  enrollment('usr_learner_01', 'ETC-120', 100),
];

/* ------------------------------------------------------------------ */
/* Payments, settlement batches                                        */
/* ------------------------------------------------------------------ */

const RAILS: PaymentRail[] = ['enaira', 'enaira', 'enaira', 'usdt', 'usdc', 'eth'];
const FX = { usdt: 1587.4, usdc: 1586.9, eth: 5_412_880 };

export const settlementBatches: SettlementBatch[] = Array.from({ length: 6 }).map((_, i) => {
  const gross = intBetween(rand, 4_200_000, 18_600_000);
  const fees = Math.round(gross * 0.009);
  return {
    id: `btc_${2026}${String(11 - i).padStart(2, '0')}`,
    rail: i === 0 ? 'mixed' : pick(rand, RAILS),
    openedAt: daysAgo(i * 7 + 6),
    closedAt: i === 0 ? null : daysAgo(i * 7),
    grossNgn: gross,
    feesNgn: fees,
    netNgn: gross - fees,
    tsaAccount: 'TSA/NITDA/0020394817',
    reference: `NITDA-STL-${2026}${String(11 - i).padStart(2, '0')}-${hex(rand, 3).slice(2).toUpperCase()}`,
    status: i === 0 ? 'open' : i === 1 ? 'reconciling' : 'remitted',
    slippagePct: Number((rand() * 0.42).toFixed(2)),
  };
});

export const payments: Payment[] = Array.from({ length: 48 }).map((_, i) => {
  const rail = RAILS[i % RAILS.length];
  const course = courses[i % 7];
  const amountNgn = course.priceNgn || 25000;
  const user = users[(i * 3) % users.length];
  const confirmed = i > 2;
  const tokenAmount =
    rail === 'enaira' ? null
      : rail === 'eth' ? Number((amountNgn / FX.eth).toFixed(5))
        : Number((amountNgn / FX[rail as 'usdt' | 'usdc']).toFixed(2));
  return {
    id: `pay_${String(i + 1).padStart(4, '0')}`,
    reference: `ETC-${daysAgo(i % 29).slice(0, 10).replace(/-/g, '')}-${String(9100 + i)}`,
    userId: user.id,
    courseId: course.id,
    rail,
    amountNgn,
    tokenAmount,
    fxRateNgn: rail === 'enaira' ? null : rail === 'eth' ? FX.eth : FX[rail as 'usdt' | 'usdc'],
    oracleRound: rail === 'enaira' ? null : `0x${(18446744073709n + BigInt(i)).toString(16)}`,
    status: i === 0 ? 'awaiting_confirmation' : i === 1 ? 'initiated' : i === 2 ? 'failed' : i < 10 ? 'confirmed' : 'settled',
    txHash: rail === 'enaira' ? null : confirmed ? hex(rand, 32) : null,
    settlementBatchId: i < 10 ? settlementBatches[0].id : settlementBatches[1 + (i % 5)].id,
    createdAt: daysAgo(i % 29, 8 + (i % 10)),
    confirmations: i === 0 ? 3 : confirmed ? intBetween(rand, 32, 240) : 0,
  };
});

/* ------------------------------------------------------------------ */
/* Soulbound credentials                                               */
/* ------------------------------------------------------------------ */

export const SBT_CONTRACT = '0x9f4E2bD5a6F08c1B4d7E9a2C5f8B1d0E3a67A3f9';

function credential(i: number, userId: string, code: string, score: number): Credential {
  const c = courseByCode(code)!;
  const grade = score >= 90 ? 'Distinction' : score >= 75 ? 'Merit' : 'Pass';
  return {
    id: `cred_${String(i).padStart(4, '0')}`,
    tokenId: 100_000 + i,
    userId,
    courseId: c.id,
    chain: 'Polygon PoS',
    contract: SBT_CONTRACT,
    standard: 'ERC-721 (Soulbound)',
    txHash: hex(rand, 32),
    blockNumber: 72_410_000 + i * 137,
    metadataUri: `ipfs://bafybeig${hex(rand, 10).slice(2)}/${100_000 + i}.json`,
    issuedAt: daysAgo(intBetween(rand, 2, 60)),
    grade,
    score,
    verificationCode: `NITDA-${c.code.replace('-', '')}-${String(100_000 + i)}`,
    revoked: false,
    revokedReason: null,
  };
}

export const credentials: Credential[] = [
  credential(1, 'usr_learner_01', 'ETC-101', 91),
  credential(2, 'usr_learner_01', 'ETC-150', 84),
  credential(3, 'usr_learner_01', 'ETC-120', 78),
  // Remaining registry entries belong to the synthetic cohort, never to the
  // curated demo accounts, so each demo persona stays internally consistent.
  ...Array.from({ length: 21 }).map((_, i) => {
    const cohort = users.slice(4);
    return credential(4 + i, cohort[(i * 5) % cohort.length].id, COURSE_SEEDS[i % 7].code, intBetween(rand, 70, 98));
  }),
];

/* ------------------------------------------------------------------ */
/* Audit trail                                                         */
/* ------------------------------------------------------------------ */

const AUDIT_SEEDS: [string, string, AuditEvent['severity'], string][] = [
  ['sbt.mint', 'Credential #100024 → 0x4D9a…1B4d', 'notice', 'usr_admin_01'],
  ['treasury.remit', 'Batch btc_202610 → TSA/NITDA/0020394817', 'notice', 'usr_admin_01'],
  ['course.publish', 'ETC-210 Nigeria Data Protection Act Compliance', 'info', 'usr_rev_01'],
  ['qa.changes_requested', 'ETC-240 Data Analytics for Policy', 'warning', 'usr_rev_01'],
  ['auth.mfa_enrolled', 'usr_017 TOTP enrolled', 'info', 'usr_017'],
  ['payment.failed', 'pay_0003 USDT slippage guard tripped', 'warning', 'usr_admin_01'],
  ['user.suspended', 'usr_015 suspended pending NDPR review', 'critical', 'usr_admin_01'],
  ['ai.moderation_flag', 'ETC-230 Module 2 cited source missing', 'warning', 'usr_instr_01'],
  ['oracle.update', 'Chainlink NGN/USD round 0x10c6f7a0b5ed', 'info', 'usr_admin_01'],
  ['export.ndpr_dsar', 'DSAR export for usr_012 (encrypted)', 'notice', 'usr_admin_01'],
  ['contract.pause_check', 'SBT registry pause guard verified', 'info', 'usr_admin_01'],
  ['enaira.callback', 'CBN callback verified, ref ETC-20261103-9140', 'info', 'usr_admin_01'],
];

export const auditEvents: AuditEvent[] = AUDIT_SEEDS.map(([action, target, severity, actorId], i) => {
  const actor = users.find((u) => u.id === actorId) ?? users[0];
  return {
    id: `aud_${String(i + 1).padStart(4, '0')}`,
    ts: daysAgo(Math.floor(i / 3), 18 - i),
    actorId: actor.id,
    actorName: actor.name,
    action,
    target,
    ip: `102.89.${intBetween(rand, 2, 250)}.${intBetween(rand, 2, 250)}`,
    severity,
  };
});

/* ------------------------------------------------------------------ */
/* AI jobs                                                             */
/* ------------------------------------------------------------------ */

export const aiJobs: AiJob[] = [
  { id: 'aij_0001', kind: 'syllabus', prompt: 'Build a 24-hour intermediate course on Web3 custody and VASP compliance for Nigerian institutions', status: 'succeeded', model: 'claude-opus-5', tokensIn: 1420, tokensOut: 5880, costNgn: 3120, createdAt: daysAgo(3, 11), courseId: 'crs_etc230' },
  { id: 'aij_0002', kind: 'quiz', prompt: 'Generate 20 MCQs with rationales for eNaira merchant settlement', status: 'succeeded', model: 'claude-opus-5', tokensIn: 980, tokensOut: 3410, costNgn: 1840, createdAt: daysAgo(2, 14), courseId: 'crs_etc102' },
  { id: 'aij_0003', kind: 'moderation', prompt: 'Scan ETC-240 Module 2 for plagiarism, policy and accessibility issues', status: 'succeeded', model: 'claude-haiku-5-5', tokensIn: 7600, tokensOut: 620, costNgn: 410, createdAt: daysAgo(1, 9), courseId: 'crs_etc240' },
  { id: 'aij_0004', kind: 'grading', prompt: 'Grade 184 Solidity lab submissions against the ETC-201 rubric', status: 'running', model: 'claude-sonnet-5-5', tokensIn: 41200, tokensOut: 9800, costNgn: 7260, createdAt: daysAgo(0, 8), courseId: 'crs_etc201' },
  { id: 'aij_0005', kind: 'notes', prompt: 'Draft lecture notes for “Three-way reconciliation controls”', status: 'queued', model: 'claude-opus-5', tokensIn: 0, tokensOut: 0, costNgn: 0, createdAt: daysAgo(0, 9), courseId: 'crs_etc102' },
];

export const userById = (id: string) => users.find((u) => u.id === id);

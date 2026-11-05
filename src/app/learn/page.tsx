import Link from 'next/link';
import type { Metadata } from 'next';
import { AppShell, requireUser } from '@/components/app-shell';
import { CourseCard } from '@/components/course-card';
import { Icon } from '@/components/icons';
import { Badge, Card, CardHead, Mono, Progress, SectionTitle, StatTile } from '@/components/ui';
import { dateTime, ngn, num, relative, shortDate, truncMid } from '@/lib/format';
import {
  credentialsFor, enrollmentsFor, findCourse, findUser, paymentsFor, publishedCourses,
} from '@/lib/store';
import { RAIL_LABEL } from '@/lib/types';

export const metadata: Metadata = { title: 'Learner dashboard' };

export default async function LearnerDashboard() {
  const session = await requireUser(['learner']);
  const user = findUser(session.id)!;
  const enrolments = enrollmentsFor(user.id);
  const active = enrolments.filter((e) => e.progressPct < 100).sort((a, b) => b.progressPct - a.progressPct);
  const done = enrolments.filter((e) => e.progressPct === 100);
  const creds = credentialsFor(user.id);
  const pays = paymentsFor(user.id).slice(0, 3);

  const hours = enrolments.reduce((n, e) => {
    const c = findCourse(e.courseId);
    return n + (c ? (c.hours * e.progressPct) / 100 : 0);
  }, 0);
  const avgScore = done.length
    ? done.reduce((n, e) => n + (e.score ?? 0), 0) / done.length
    : 0;

  const upcoming = active
    .filter((e) => e.dueAt)
    .sort((a, b) => (a.dueAt ?? '').localeCompare(b.dueAt ?? ''))
    .slice(0, 4);

  const enrolledIds = new Set(enrolments.map((e) => e.courseId));
  const recommended = publishedCourses().filter((c) => !enrolledIds.has(c.id)).slice(0, 3);

  return (
    <AppShell
      allow={['learner']}
      title={`Welcome back, ${user.name.split(' ')[0]}`}
      subtitle={`${user.mda} · ${user.state} · last signed in ${relative(user.lastSeen)}`}
    >
      {/* KPI row — single-headline figures, so hero numbers rather than charts */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Courses in progress" value={String(active.length)}
          sub={`${done.length} completed`} tone="brand"
          icon={<Icon name="book" size={20} />}
        />
        <StatTile
          label="On-chain credentials" value={String(creds.length)}
          sub="Soulbound · Polygon PoS" tone="chain"
          trend={{ dir: 'up', text: '+1 this month' }}
          icon={<Icon name="certificate" size={20} />}
        />
        <StatTile
          label="Learning hours logged" value={hours.toFixed(1)}
          sub="Counts toward NITDA CPD" tone="gold"
          icon={<Icon name="chart" size={20} />}
        />
        <StatTile
          label="Assessment average" value={`${avgScore.toFixed(0)}%`}
          sub={avgScore >= 75 ? 'Merit band' : 'Pass band'} tone="plain"
          trend={{ dir: 'up', text: '+4 pts' }}
          icon={<Icon name="review" size={20} />}
        />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionTitle hint={`${active.length} active enrolments`}>Continue learning</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {active.slice(0, 4).map((e) => {
              const course = findCourse(e.courseId)!;
              return <CourseCard key={e.id} course={course} enrollment={e} />;
            })}
          </div>

          <div className="mt-8" />
          <SectionTitle hint="Chosen from your track and role">Recommended for you</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            {recommended.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>

        <div className="space-y-6">
          {/* AI learning assistant */}
          <Card>
            <CardHead
              title="AI learning assistant"
              hint="Available 24/7 across every enrolled course"
              action={<Badge tone="good">Online</Badge>}
            />
            <div className="p-5">
              <div className="rounded-lg bg-nitda-50 p-3.5">
                <p className="text-[12.5px] leading-relaxed text-nitda-800">
                  You left off at <strong>“Three-way reconciliation controls”</strong> in ETC-102.
                  Want me to summarise the settlement cut-off rules before you continue?
                </p>
              </div>
              <ul className="mt-3 space-y-1.5">
                {[
                  'Explain T+0 settlement in simple terms',
                  'Quiz me on eNaira wallet tiers',
                  'Review my Solidity lab submission',
                ].map((q) => (
                  <li key={q}>
                    <Link
                      href={`/learn/tutor?q=${encodeURIComponent(q)}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-ink-200 px-3 py-2 text-[12.5px] text-ink-700 transition hover:border-nitda-300 hover:bg-nitda-50/60"
                    >
                      {q}
                      <span aria-hidden="true" className="text-nitda-500">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/learn/tutor" className="btn-primary mt-4 w-full">
                <Icon name="robot" size={16} /> Open the assistant
              </Link>
            </div>
          </Card>

          {/* Deadlines */}
          <Card>
            <CardHead title="Upcoming deadlines" hint="Assessment and cohort cut-offs" />
            <ul className="divide-y divide-ink-100">
              {upcoming.map((e) => {
                const c = findCourse(e.courseId)!;
                return (
                  <li key={e.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-gold-50 text-gold-700">
                      <span className="text-[13px] font-bold leading-none">{new Date(e.dueAt!).getUTCDate()}</span>
                      <span className="text-[8.5px] font-semibold uppercase leading-none">
                        {shortDate(e.dueAt!).split(' ')[1]}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-ink-800">{c.code} assessment</span>
                      <span className="block truncate text-[11.5px] text-ink-500">{e.nextLesson}</span>
                    </span>
                    <span className="shrink-0 text-[11.5px] font-semibold text-ink-600">
                      {Math.round((new Date(e.dueAt!).getTime() - Date.parse('2026-11-05T09:30:00Z')) / 86_400_000)}d
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Credentials */}
          <Card>
            <CardHead
              title="My credentials"
              hint="Non-transferable soulbound tokens"
              action={<Link href="/learn/credentials" className="text-[12px] font-semibold text-nitda-600 hover:underline">View all</Link>}
            />
            <ul className="divide-y divide-ink-100">
              {creds.slice(0, 3).map((c) => {
                const course = findCourse(c.courseId)!;
                return (
                  <li key={c.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-ink-900">{course.title}</p>
                        <p className="mt-0.5 text-[11.5px] text-ink-500">
                          {c.grade} · {c.score}% · issued {shortDate(c.issuedAt)}
                        </p>
                      </div>
                      <Badge tone="chain">#{c.tokenId}</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <Mono>{truncMid(c.txHash, 10, 8)}</Mono>
                      <Link href={`/verify?code=${c.verificationCode}`} className="text-[11.5px] font-semibold text-nitda-600 hover:underline">
                        Verify →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Wallet / payments */}
          <Card>
            <CardHead
              title="Payments & wallet"
              action={<Link href="/learn/payments" className="text-[12px] font-semibold text-nitda-600 hover:underline">Manage</Link>}
            />
            <div className="p-5">
              <div className="rounded-lg border border-ink-200 p-3.5">
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-500">Linked wallet</p>
                <Mono className="mt-1 block break-all text-[11.5px]">{user.walletAddress}</Mono>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Badge tone="good">eNaira tier 3</Badge>
                  <Badge tone="chain">Polygon PoS</Badge>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {pays.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 text-[12.5px]">
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink-800">{RAIL_LABEL[p.rail]}</span>
                      <span className="block text-[11px] text-ink-500">{dateTime(p.createdAt)}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-semibold tabular-nums text-ink-900">{ngn(p.amountNgn)}</span>
                      <span className="block text-[11px] capitalize text-ink-500">{p.status.replace('_', ' ')}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11.5px] text-ink-400">
                {num(creds.length)} credential{creds.length === 1 ? '' : 's'} minted to this wallet · gas sponsored by NITDA
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

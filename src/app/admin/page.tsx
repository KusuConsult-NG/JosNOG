import Link from 'next/link';
import type { Metadata } from 'next';
import { AppShell } from '@/components/app-shell';
import { BarsH, LineChart, StackedBars } from '@/components/charts';
import { Icon } from '@/components/icons';
import { Badge, Card, CardHead, Mono, Progress, SectionTitle, StatTile } from '@/components/ui';
import {
  budgetTotals, BUDGET, engagementTrend, platformTotals, railVolume, topCoursesByEnrolment,
} from '@/lib/analytics';
import { dateTime, ngn, num, pct, relative, truncMid } from '@/lib/format';
import {
  coursesAwaitingQa, findUser, recentAiJobs, recentAudit, recentPayments, SBT_CONTRACT,
} from '@/lib/store';
import { RAIL_LABEL, type PaymentRail } from '@/lib/types';
import { CATEGORICAL, RAIL_COLOR, STATUS } from '@/lib/viz';

export const metadata: Metadata = { title: 'NITDA command centre' };

const SEVERITY_TONE = {
  info: 'neutral', notice: 'good', warning: 'warning', critical: 'critical',
} as const;

export default async function AdminDashboard() {
  const t = platformTotals();
  const trend = engagementTrend();
  const rails = railVolume();
  const qa = coursesAwaitingQa();
  const audit = recentAudit(7);
  const jobs = recentAiJobs(4);
  const pays = recentPayments(6);
  const budget = budgetTotals();

  const railSeries = (['enaira', 'usdt', 'usdc', 'eth'] as PaymentRail[]).map((r) => ({
    key: r,
    label: RAIL_LABEL[r],
    color: RAIL_COLOR[r],
    values: rails.byRail[r],
  }));

  const monthTotal = railSeries.reduce((n, s) => n + s.values[s.values.length - 1], 0);

  return (
    <AppShell
      allow={['admin']}
      title="NITDA command centre"
      subtitle="National learning platform · credential registry · treasury settlement — live as at 5 Nov 2026, 09:30 WAT"
    >
      {/* ---------------- KPI row ---------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatTile
          label="Active learners" value={num(t.learnersOnPlatform, { compact: true })}
          sub="36 MDAs · 18 states" tone="brand"
          trend={{ dir: 'up', text: '+12.4% MoM' }}
          icon={<Icon name="users" size={20} />}
        />
        <StatTile
          label="Credentials minted" value={num(t.credentialsMinted, { compact: true })}
          sub="Soulbound · Polygon PoS" tone="chain"
          trend={{ dir: 'up', text: '+1,842 this month' }}
          icon={<Icon name="certificate" size={20} />}
        />
        <StatTile
          label="Settled to TSA" value={ngn(t.settledNgn, { compact: true })}
          sub="Net of 0.9% rail fees" tone="gold"
          trend={{ dir: 'up', text: '+18.2% MoM' }}
          icon={<Icon name="treasury" size={20} />}
        />
        <StatTile
          label="Courses live" value={`${t.publishedCourses}`}
          sub={`${t.contentHours}h content · ${num(t.lessons)} lessons`} tone="plain"
          trend={{ dir: 'flat', text: `${qa.length} in QA` }}
          icon={<Icon name="book" size={20} />}
        />
        <StatTile
          label="Completion rate" value={pct(t.completionRate, 1)}
          sub="Target ≥ 55%" tone="brand"
          trend={{ dir: 'up', text: '+3.1 pts' }}
          icon={<Icon name="chart" size={20} />}
        />
      </div>

      {/* ---------------- charts ---------------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHead
            title="Enrolments and completions"
            hint="Monthly cohort movement across all published courses"
          />
          <div className="p-5 pt-3">
            <LineChart
              labels={trend.labels}
              caption="Monthly enrolments and completions, April to November 2026"
              format="numCompact"
              series={[
                { key: 'enrol', label: 'Enrolments', color: CATEGORICAL[0], values: trend.enrolments },
                { key: 'complete', label: 'Completions', color: CATEGORICAL[2], values: trend.completions },
              ]}
            />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHead
            title="Payment volume by rail"
            hint={`${ngn(monthTotal, { compact: true })} collected in November`}
          />
          <div className="p-5 pt-3">
            <StackedBars
              labels={rails.labels}
              series={railSeries}
              caption="Monthly payment volume in Naira by settlement rail, June to November 2026"
              format="ngnCompact"
            />
          </div>
        </Card>
      </div>

      {/* ---------------- operations ---------------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHead
            title="Content QA queue"
            hint="Automated screening plus human sign-off"
            action={<Link href="/review" className="text-[12px] font-semibold text-nitda-600 hover:underline">Open queue</Link>}
          />
          <ul className="divide-y divide-ink-100">
            {qa.map((c) => (
              <li key={c.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink-900">{c.code} · {c.title}</p>
                    <p className="mt-0.5 text-[11.5px] text-ink-500">
                      {findUser(c.instructorId)?.name} · updated {relative(c.updatedAt)}
                    </p>
                  </div>
                  <Badge tone={c.status === 'in_qa' ? 'warning' : 'serious'}>
                    {c.status === 'in_qa' ? 'Awaiting review' : 'Changes requested'}
                  </Badge>
                </div>
                {c.qa ? (
                  <dl className="mt-2.5 grid grid-cols-3 gap-2 text-[11.5px]">
                    <div>
                      <dt className="text-ink-500">Plagiarism</dt>
                      <dd className="font-semibold tabular-nums" style={{ color: c.qa.plagiarismPct > 10 ? STATUS.serious : STATUS.good }}>
                        {c.qa.plagiarismPct}%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">Toxicity</dt>
                      <dd className="font-semibold tabular-nums" style={{ color: STATUS.good }}>{c.qa.toxicityPct}%</dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">Accessibility</dt>
                      <dd className="font-semibold tabular-nums" style={{ color: c.qa.accessibility < 85 ? STATUS.warning : STATUS.good }}>
                        {c.qa.accessibility}
                      </dd>
                    </div>
                  </dl>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="border-t border-ink-100 px-5 py-3.5 text-[11.5px] text-ink-500">
            Every other published course cleared automated screening — plagiarism under 4%,
            toxicity under 1% and accessibility at or above 88.
          </div>
        </Card>

        <Card>
          <CardHead
            title="Treasury & settlement"
            hint="Automated NGN conversion into the TSA"
            action={<Link href="/admin/treasury" className="text-[12px] font-semibold text-nitda-600 hover:underline">Reconcile</Link>}
          />
          <div className="p-5">
            {t.openBatch ? (
              <div className="rounded-lg border border-nitda-200 bg-nitda-50 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-nitda-700">Open batch</p>
                  <Badge tone="good">Collecting</Badge>
                </div>
                <p className="stat-num mt-1.5 text-[22px]">{ngn(t.openBatch.grossNgn)}</p>
                <p className="mt-1 text-[11.5px] text-nitda-700">
                  {t.openBatch.reference} → {t.openBatch.tsaAccount}
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11.5px]">
                  <div>
                    <p className="text-ink-500">Rail fees</p>
                    <p className="font-semibold tabular-nums text-ink-800">{ngn(t.openBatch.feesNgn)}</p>
                  </div>
                  <div>
                    <p className="text-ink-500">FX slippage</p>
                    <p className="font-semibold tabular-nums text-ink-800">{t.openBatch.slippagePct}%</p>
                  </div>
                </div>
              </div>
            ) : null}

            <ul className="mt-3.5 space-y-2.5">
              {pays.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="h-7 w-1 rounded-full" style={{ background: RAIL_COLOR[p.rail] }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink-800">
                      {RAIL_LABEL[p.rail]} · {p.reference}
                    </span>
                    <span className="block text-[11px] text-ink-500">{dateTime(p.createdAt)}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[12.5px] font-semibold tabular-nums text-ink-900">{ngn(p.amountNgn)}</span>
                    <span
                      className="block text-[10.5px] font-semibold capitalize"
                      style={{ color: p.status === 'failed' ? STATUS.critical : p.status === 'settled' ? STATUS.good : STATUS.warning }}
                    >
                      {p.status.replace('_', ' ')}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <CardHead title="Credential registry health" hint="Soulbound token contract on Polygon PoS" action={<Badge tone="good">Operational</Badge>} />
          <div className="p-5">
            <dl className="space-y-3 text-[12.5px]">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-ink-500">Registry contract</dt>
                <dd><Mono>{truncMid(SBT_CONTRACT, 12, 8)}</Mono></dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-500">Standard</dt>
                <dd className="font-medium text-ink-800">ERC-721, transfer-locked</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-500">Mints (24h)</dt>
                <dd className="font-semibold tabular-nums text-ink-900">146</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-500">Avg. gas / mint</dt>
                <dd className="font-semibold tabular-nums text-ink-900">{ngn(42)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-500">Revocations</dt>
                <dd className="font-semibold tabular-nums text-ink-900">0</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-500">Last audit</dt>
                <dd className="font-medium text-ink-800">CertiK · 12 Sep 2026 · no criticals</dd>
              </div>
            </dl>
            <div className="mt-4 rounded-lg bg-ink-50 p-3">
              <Progress value={99.98} label="Verification API uptime (30d)" />
              <p className="mt-2 text-[11.5px] text-ink-500">
                p95 verification latency 240&nbsp;ms · target &lt; 2&nbsp;s
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ---------------- ranked magnitude + AI + audit ---------------- */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHead title="Top courses by enrolment" hint="Published catalogue" />
          <div className="p-5">
            <BarsH
              rows={topCoursesByEnrolment(5)}
              color={CATEGORICAL[0]}
              format="num"
              caption="Top five published courses ranked by enrolment"
            />
          </div>
        </Card>

        <Card>
          <CardHead
            title="AI workflow operations"
            hint="Authoring, grading and moderation jobs"
            action={<Link href="/admin/ai" className="text-[12px] font-semibold text-nitda-600 hover:underline">Details</Link>}
          />
          <ul className="divide-y divide-ink-100">
            {jobs.map((j) => (
              <li key={j.id} className="flex items-start gap-3 px-5 py-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-chain/10 text-chain">
                  <Icon name="sparkles" size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold capitalize text-ink-900">{j.kind} job</span>
                  <span className="line-clamp-1 block text-[11.5px] text-ink-500">{j.prompt}</span>
                  <span className="mt-1 block text-[11px] text-ink-400">
                    {j.model} · {num(j.tokensIn + j.tokensOut)} tokens · {ngn(j.costNgn)}
                  </span>
                </span>
                <Badge tone={j.status === 'succeeded' ? 'good' : j.status === 'running' ? 'warning' : 'neutral'}>
                  {j.status}
                </Badge>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink-100 px-5 py-3.5">
            <Progress value={68} label="Monthly AI compute budget used" tone="gold" />
            <p className="mt-2 text-[11.5px] text-ink-500">
              Authoring time saved to date: {num(1840)} staff-hours (−71% design effort)
            </p>
          </div>
        </Card>

        <Card>
          <CardHead
            title="Audit trail"
            hint="Immutable, NDPR-retained for 7 years"
            action={<Link href="/admin/audit" className="text-[12px] font-semibold text-nitda-600 hover:underline">Full log</Link>}
          />
          <ul className="divide-y divide-ink-100">
            {audit.map((e) => (
              <li key={e.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <Mono className="text-[11.5px] font-semibold text-ink-800">{e.action}</Mono>
                  <Badge tone={SEVERITY_TONE[e.severity]}>{e.severity}</Badge>
                </div>
                <p className="mt-1 line-clamp-1 text-[11.5px] text-ink-600">{e.target}</p>
                <p className="mt-0.5 text-[11px] text-ink-400">{e.actorName} · {relative(e.ts)} · {e.ip}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ---------------- programme budget ---------------- */}
      <div className="mt-6">
        <Card>
          <CardHead
            title="Programme budget utilisation"
            hint={`Ceiling ${ngn(budget.planned)} · committed ${ngn(budget.committed)} · remaining ${ngn(budget.remaining)}`}
            action={<Badge tone={budget.utilisation <= 100 ? 'good' : 'critical'}>{pct(budget.utilisation, 1)} drawn</Badge>}
          />
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-[13px]">
              <caption className="sr-only">
                Programme budget by category against the one hundred million Naira ceiling
              </caption>
              <thead className="bg-ink-50 text-left text-[11.5px] uppercase tracking-wide text-ink-500">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-semibold">Budget line</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-semibold">Approved</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-semibold">Committed</th>
                  <th scope="col" className="w-[26%] px-5 py-2.5 font-semibold">Utilisation</th>
                </tr>
              </thead>
              <tbody>
                {BUDGET.map((b) => (
                  <tr key={b.line} className="border-t border-ink-100">
                    <th scope="row" className="px-5 py-2.5 text-left font-medium text-ink-800">{b.line}</th>
                    <td className="px-5 py-2.5 text-right tabular-nums text-ink-700">{ngn(b.planned)}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums font-semibold text-ink-900">{ngn(b.committed)}</td>
                    <td className="px-5 py-2.5">
                      <Progress value={(b.committed / b.planned) * 100} />
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink-200 bg-ink-50/70">
                  <th scope="row" className="px-5 py-3 text-left font-semibold text-ink-900">Total programme cost</th>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-ink-900">{ngn(budget.planned)}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-ink-900">{ngn(budget.committed)}</td>
                  <td className="px-5 py-3"><Progress value={budget.utilisation} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

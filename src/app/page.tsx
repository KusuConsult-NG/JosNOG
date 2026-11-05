import Link from 'next/link';
import { EduTrustLockup, GovBand, NitdaLockup } from '@/components/brand';
import { CourseCard } from '@/components/course-card';
import { Icon } from '@/components/icons';
import { Badge, SectionTitle } from '@/components/ui';
import { getSession, HOME_FOR } from '@/lib/auth';
import { num } from '@/lib/format';
import { platformTotals } from '@/lib/analytics';
import { publishedCourses } from '@/lib/store';

const PILLARS = [
  {
    icon: 'certificate' as const,
    title: 'Credentials that cannot be forged',
    body: 'Completion mints a soulbound token to the learner’s wallet. Employers verify in seconds from a QR code or transaction hash — nothing to fake, nothing to phone in.',
  },
  {
    icon: 'wallet' as const,
    title: 'eNaira and stablecoins, settled in Naira',
    body: 'Pay by CBN eNaira QR or wallet transfer, or with USDT, USDC and ETH. Every rail converts at an oracle-verified rate and settles into NITDA’s Treasury Single Account.',
  },
  {
    icon: 'sparkles' as const,
    title: 'AI that cuts course design by 70%',
    body: 'Instructors prompt a topic; the platform drafts the syllabus, notes and assessments, then screens everything for plagiarism, policy and accessibility before publication.',
  },
  {
    icon: 'shield' as const,
    title: 'Built for Nigerian public-sector assurance',
    body: 'NDPA/NDPR-compliant processing, AES-256 at rest, TLS 1.3 in transit, audited smart contracts and a seven-year immutable audit trail.',
  },
];

export default async function HomePage() {
  const session = await getSession();
  const courses = publishedCourses().slice(0, 3);
  const t = platformTotals();

  return (
    <div className="min-h-screen bg-white">
      <GovBand />

      <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-4 py-3.5 sm:px-6">
          <EduTrustLockup size={38} />
          <nav className="hidden flex-1 items-center gap-6 text-[13.5px] font-medium text-ink-600 md:flex" aria-label="Main">
            <Link href="/catalogue" className="hover:text-nitda-700">Course catalogue</Link>
            <Link href="/verify" className="hover:text-nitda-700">Verify a certificate</Link>
            <Link href="/about" className="hover:text-nitda-700">About the programme</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2.5">
            {session ? (
              <Link href={HOME_FOR[session.role]} className="btn-primary">Go to dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">Sign in</Link>
                <Link href="/register" className="btn-primary">Create account</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden bg-nitda-800">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]" aria-hidden="true">
          <defs>
            <pattern id="hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0v56" fill="none" stroke="#FFFFFF" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00A859 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-[1240px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-gold-300 ring-1 ring-inset ring-gold-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" aria-hidden="true" />
              JosNOG Workshop · Blockchain &amp; Cryptocurrency track
            </p>
            <h1 className="mt-5 max-w-[20ch] text-[40px] font-bold leading-[1.08] tracking-tight text-white sm:text-[48px]">
              Verifiable learning for a digital Nigeria.
            </h1>
            <p className="mt-5 max-w-[62ch] text-[15.5px] leading-relaxed text-nitda-100/85">
              EduTrust-Chain is NITDA’s national e-learning and content management platform. It pairs
              AI-assisted course authoring with an immutable credential registry and native
              digital-currency payments — operationalising Nigeria’s National Blockchain Policy for
              every ministry, department and agency.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn-gold px-5 py-3 text-[14.5px]">Start learning free</Link>
              <Link href="/verify" className="btn px-5 py-3 text-[14.5px] text-white ring-1 ring-inset ring-white/35 hover:bg-white/10">
                Verify a certificate
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/15 pt-7">
              {[
                [num(t.learnersOnPlatform), 'Learners enrolled'],
                [num(t.credentialsMinted), 'On-chain credentials'],
                ['36', 'MDAs onboarded'],
                ['99.98%', 'Verification uptime'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dd className="text-[24px] font-bold tabular-nums leading-none text-white">{v}</dd>
                  <dt className="mt-1.5 text-[11.5px] uppercase tracking-wide text-nitda-200/75">{l}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-pop">
              <NitdaLockup size={46} />
              <p className="mt-4 text-[13px] leading-relaxed text-ink-600">
                Delivered for the National Information Technology Development Agency under a
                ₦100,000,000 turnkey programme: six-month build, third-party smart-contract audit and
                twelve months of operational support.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge tone="good">NDPA / NDPR compliant</Badge>
                <Badge tone="chain">Polygon Layer-2</Badge>
                <Badge tone="warning">CBN eNaira ready</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-nitda-200">Instant verification</p>
              <p className="mt-2 font-mono text-[12.5px] text-white/90">NITDA-ETC101-100001</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-nitda-100/80">
                Enter a certificate code or transaction hash on the public portal — no account, no
                login, no call to the agency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* pillars */}
      <section className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6">
        <SectionTitle hint="The four must-have capabilities of the programme">
          What EduTrust-Chain delivers
        </SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          {PILLARS.map((p) => (
            <article key={p.title} className="card flex gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-nitda-50 text-nitda-600 ring-1 ring-inset ring-nitda-200">
                <Icon name={p.icon} size={21} />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-ink-900">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* catalogue preview */}
      <section className="border-y border-ink-200 bg-ink-50/60">
        <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6">
          <SectionTitle hint={`${t.publishedCourses} courses live · ${t.contentHours} hours of content`}>
            Featured courses
          </SectionTitle>
          <div className="grid gap-5 md:grid-cols-3">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          <div className="mt-7">
            <Link href="/catalogue" className="btn-ghost">Browse the full catalogue →</Link>
          </div>
        </div>
      </section>

      <footer className="bg-nitda-900 text-nitda-100">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <EduTrustLockup reverse size={40} href={null} />
            <p className="mt-4 max-w-[46ch] text-[12.5px] leading-relaxed text-nitda-200/75">
              An official digital skills platform of the National Information Technology Development
              Agency, Federal Republic of Nigeria. Operationalising the National Blockchain Policy
              and the National Digital Economy Policy and Strategy.
            </p>
          </div>
          <nav aria-label="Platform">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-nitda-300">Platform</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li><Link href="/catalogue" className="hover:text-white">Course catalogue</Link></li>
              <li><Link href="/verify" className="hover:text-white">Verification portal</Link></li>
              <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
              <li><Link href="/register" className="hover:text-white">Create an account</Link></li>
            </ul>
          </nav>
          <nav aria-label="Governance">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-nitda-300">Governance</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li><Link href="/legal/privacy" className="hover:text-white">NDPR privacy notice</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white">Terms of use</Link></li>
              <li><Link href="/legal/accessibility" className="hover:text-white">Accessibility statement</Link></li>
              <li><Link href="/about" className="hover:text-white">Programme &amp; budget</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-[11.5px] text-nitda-300/80 sm:px-6">
          © {new Date().getFullYear()} National Information Technology Development Agency. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

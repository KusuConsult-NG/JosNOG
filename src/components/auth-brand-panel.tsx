import { NitdaLockup } from './brand';

const FEATURES = [
  {
    title: 'Credentials you can prove in seconds',
    body: 'Every certificate is a soulbound token minted to the learner’s wallet on Polygon. Employers verify with a QR scan — no phone calls, no forgeries.',
    icon: (
      <path d="M12 3 20 6v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z M9 12.5 11.3 15 15.5 10" />
    ),
  },
  {
    title: 'Pay with eNaira or compliant stablecoins',
    body: 'CBN eNaira QR and wallet transfer alongside USDT, USDC and ETH, auto-converted to Naira and settled into NITDA’s Treasury Single Account.',
    icon: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5v-9Z M16 12h2" />,
  },
  {
    title: 'AI that builds courses and tutors learners',
    body: 'Syllabus, notes and assessments generated from a prompt, screened for plagiarism and policy, with a 24/7 assistant beside every lesson.',
    icon: <path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4L12 3Z M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />,
  },
];

const STATS = [
  { value: '68,540', label: 'Learners enrolled' },
  { value: '24,117', label: 'On-chain credentials' },
  { value: '36', label: 'MDAs onboarded' },
];

/** The federal-green brand rail shared by every unauthenticated page. */
export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-nitda-800 lg:flex lg:w-[48%] lg:flex-col lg:justify-between">
      {/* ledger-grid texture */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]" aria-hidden="true">
        <defs>
          <pattern id="ledger" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0v48" fill="none" stroke="#FFFFFF" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ledger)" />
      </svg>
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #00A859 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative px-10 pt-9">
        <div className="inline-flex items-center gap-4 rounded-xl bg-white/95 px-4 py-3 shadow-pop">
          <NitdaLockup size={42} />
        </div>
      </div>

      <div className="relative flex-1 px-10 py-7">
        <p className="inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-gold-300 ring-1 ring-inset ring-gold-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-300" aria-hidden="true" />
          JosNOG Workshop · Blockchain &amp; Cryptocurrency track
        </p>
        <h2 className="mt-4 max-w-[22ch] text-[34px] font-bold leading-[1.1] tracking-tight text-white">
          Verifiable learning for a digital Nigeria.
        </h2>
        <p className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-nitda-100/85">
          EduTrust-Chain is NITDA’s national learning platform — AI-assisted authoring, immutable
          credentialing and native digital-currency payments, delivered under the National Blockchain Policy.
        </p>

        <ul className="mt-7 space-y-4">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/20 text-accent-300 ring-1 ring-inset ring-accent-500/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {f.icon}
                </svg>
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-white">{f.title}</span>
                <span className="mt-1 block max-w-[48ch] text-[12.5px] leading-relaxed text-nitda-100/75">{f.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative border-t border-white/10 px-10 py-6">
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <dd className="text-[22px] font-bold tabular-nums leading-none text-white">{s.value}</dd>
              <dt className="mt-1.5 text-[11.5px] uppercase tracking-wide text-nitda-200/75">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

import Link from 'next/link';

/** The NITDA emblem — globe grid + development chevron, in the agency green. */
export function NitdaEmblem({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = 'ne';
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" className={className} role="img"
         aria-label="National Information Technology Development Agency emblem">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1B7339" />
          <stop offset="1" stopColor="#0B381C" />
        </linearGradient>
        <clipPath id={`${id}-c`}><circle cx="64" cy="64" r="48" /></clipPath>
      </defs>
      <circle cx="64" cy="64" r="60" fill={`url(#${id}-g)`} />
      <circle cx="64" cy="64" r="53" fill="none" stroke="#E2A32B" strokeWidth="2.5" />
      <g clipPath={`url(#${id}-c)`} fill="none" stroke="#FFFFFF" strokeWidth="2.2" opacity=".55">
        <circle cx="64" cy="64" r="48" />
        <ellipse cx="64" cy="64" rx="20" ry="48" />
        <ellipse cx="64" cy="64" rx="38" ry="48" />
        <path d="M16 48h96M16 64h96M16 80h96" />
      </g>
      <g clipPath={`url(#${id}-c)`}>
        <path d="M38 86 58 58l14 14 20-30" fill="none" stroke="#FFFFFF" strokeWidth="7"
              strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="86" r="6.5" fill="#E2A32B" />
        <circle cx="58" cy="58" r="6.5" fill="#FFFFFF" />
        <circle cx="72" cy="72" r="6.5" fill="#FFFFFF" />
        <circle cx="92" cy="42" r="7.5" fill="#E2A32B" />
      </g>
    </svg>
  );
}

/** Full NITDA lockup: emblem + wordmark + agency name. */
export function NitdaLockup({ reverse = false, size = 40 }: { reverse?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-3">
      <NitdaEmblem size={size} />
      <span className="leading-none">
        <span className={`block font-serif text-[1.1rem] font-bold tracking-[0.14em] ${reverse ? 'text-white' : 'text-nitda-700'}`}>
          NITDA
        </span>
        <span className={`mt-1 block text-[10px] leading-[1.25] tracking-wide ${reverse ? 'text-nitda-100' : 'text-ink-500'}`}>
          National Information Technology<br />Development Agency
        </span>
      </span>
    </span>
  );
}

/** EduTrust-Chain product mark — shield, verification tick, ledger nodes. */
export function EduTrustMark({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label="EduTrust-Chain">
      <defs>
        <linearGradient id="etm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1B7339" />
          <stop offset="1" stopColor="#00A859" />
        </linearGradient>
      </defs>
      <path d="M32 3 56 12v22c0 13.2-9.6 22.6-24 27C17.6 56.6 8 47.2 8 34V12L32 3Z" fill="url(#etm-g)" />
      <path d="M32 3 56 12v22c0 13.2-9.6 22.6-24 27C17.6 56.6 8 47.2 8 34V12L32 3Z"
            fill="none" stroke="#E2A32B" strokeWidth="1.6" opacity=".9" />
      <path d="M21 32.5 28.5 40 44 24" fill="none" stroke="#FFFFFF" strokeWidth="3.2"
            strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 20 32 14l16 6" fill="none" stroke="#FFFFFF" strokeWidth="1.3" opacity=".55" />
      <g fill="#FFFFFF" opacity=".92">
        <circle cx="16" cy="20" r="2.3" /><circle cx="32" cy="14" r="2.3" /><circle cx="48" cy="20" r="2.3" />
      </g>
    </svg>
  );
}

export function EduTrustLockup({ reverse = false, size = 36, href = '/' }: { reverse?: boolean; size?: number; href?: string | null }) {
  const inner = (
    <span className="flex items-center gap-2.5">
      <EduTrustMark size={size} />
      <span className="leading-none">
        <span className={`block text-[1.05rem] font-bold tracking-tight ${reverse ? 'text-white' : 'text-nitda-700'}`}>
          EduTrust<span className={reverse ? 'text-accent-300' : 'text-accent-500'}>-Chain</span>
        </span>
        <span className={`mt-[3px] block text-[9.5px] font-semibold uppercase tracking-[0.11em] ${reverse ? 'text-nitda-100/80' : 'text-ink-400'}`}>
          A NITDA Digital Skills Platform
        </span>
      </span>
    </span>
  );
  return href ? <Link href={href} className="shrink-0">{inner}</Link> : inner;
}

/** The federal authority band that tops every page. */
export function GovBand() {
  return (
    <div className="gov-band">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-1.5 text-[11.5px] text-white/90 sm:px-6">
        <span className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2 4 5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V5l-8-3Z" />
          </svg>
          An official platform of the Federal Republic of Nigeria
        </span>
        <span className="hidden sm:inline">
          Operationalising the National Blockchain Policy
        </span>
      </div>
    </div>
  );
}

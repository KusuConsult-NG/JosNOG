import type { ReactNode } from 'react';
import { STATUS } from '@/lib/viz';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function CardHead({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-ink-100 px-5 py-4">
      <div>
        <h2 className="text-[15px] font-semibold text-ink-900">{title}</h2>
        {hint ? <p className="mt-0.5 text-[12.5px] text-ink-500">{hint}</p> : null}
      </div>
      {action}
    </header>
  );
}

/**
 * Stat tile — a hero number is the right form when the data's job is a single
 * headline, so the figure carries the weight and any trend sits beside it.
 */
export function StatTile({
  label, value, sub, trend, tone = 'brand', icon,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: { dir: 'up' | 'down' | 'flat'; text: string; good?: boolean };
  tone?: 'brand' | 'gold' | 'chain' | 'plain';
  icon?: ReactNode;
}) {
  const bar = {
    brand: 'bg-nitda-500',
    gold: 'bg-gold-500',
    chain: 'bg-chain',
    plain: 'bg-ink-300',
  }[tone];

  return (
    <div className="card relative overflow-hidden p-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-ink-500">{label}</p>
        {icon ? <span className="text-ink-300">{icon}</span> : null}
      </div>
      <p className="stat-num mt-2 text-[28px] leading-none">{value}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
        {trend ? (
          <span
            className="inline-flex items-center gap-1 font-semibold"
            style={{ color: trend.good === false ? STATUS.serious : trend.dir === 'flat' ? STATUS.neutral : STATUS.good }}
          >
            <span aria-hidden="true">{trend.dir === 'up' ? '▲' : trend.dir === 'down' ? '▼' : '■'}</span>
            {trend.text}
          </span>
        ) : null}
        {sub ? <span className="text-ink-500">{sub}</span> : null}
      </div>
    </div>
  );
}

type Tone = 'good' | 'warning' | 'serious' | 'critical' | 'brand' | 'chain' | 'neutral';

const TONE_CLASS: Record<Tone, string> = {
  good: 'bg-nitda-50 text-nitda-700 ring-1 ring-inset ring-nitda-200',
  warning: 'bg-gold-50 text-gold-700 ring-1 ring-inset ring-gold-300/70',
  serious: 'bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-200',
  critical: 'bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-200',
  brand: 'bg-nitda-500 text-white',
  chain: 'bg-chain/10 text-chain ring-1 ring-inset ring-chain/25',
  neutral: 'bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200',
};

const TONE_ICON: Record<Tone, string> = {
  good: '✓', warning: '!', serious: '!', critical: '✕', brand: '●', chain: '⛓', neutral: '•',
};

/** Status is never colour alone — every badge carries a glyph and a label. */
export function Badge({ tone = 'neutral', children, glyph = true }: { tone?: Tone; children: ReactNode; glyph?: boolean }) {
  return (
    <span className={`chip ${TONE_CLASS[tone]}`}>
      {glyph ? <span aria-hidden="true" className="text-[10px] leading-none">{TONE_ICON[tone]}</span> : null}
      {children}
    </span>
  );
}

export function Progress({ value, label, tone = 'brand' }: { value: number; label?: string; tone?: 'brand' | 'gold' }) {
  const color = tone === 'gold' ? 'bg-gold-500' : 'bg-nitda-500';
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] text-ink-600">
        {label ? <span>{label}</span> : <span />}
        <span className="font-semibold tabular-nums text-ink-800">{Math.round(value)}%</span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-100"
        role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function Avatar({ name, size = 36, tone = 'brand' }: { name: string; size?: number; tone?: 'brand' | 'gold' | 'ink' }) {
  const bg = tone === 'gold' ? 'bg-gold-100 text-gold-700' : tone === 'ink' ? 'bg-ink-200 text-ink-700' : 'bg-nitda-100 text-nitda-700';
  const init = name.replace(/^(Dr|Prof|Mr|Mrs|Ms|Engr)\.?\s+/i, '').split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${bg}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {init}
    </span>
  );
}

export function Mono({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <code className={`font-mono text-[12px] text-ink-600 ${className}`}>{children}</code>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-nitda-50 text-nitda-500">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
        </svg>
      </div>
      <p className="text-[15px] font-semibold text-ink-800">{title}</p>
      <p className="max-w-sm text-[13px] text-ink-500">{body}</p>
      {action}
    </div>
  );
}

export function SectionTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <h2 className="text-[17px] font-semibold tracking-tight text-ink-900">{children}</h2>
      {hint ? <p className="text-[12.5px] text-ink-500">{hint}</p> : null}
    </div>
  );
}

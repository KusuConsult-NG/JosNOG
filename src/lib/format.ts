export const NGN = '₦';

export function ngn(amount: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) {
    if (amount >= 1_000_000_000) return `${NGN}${(amount / 1_000_000_000).toFixed(2)}bn`;
    if (amount >= 1_000_000) return `${NGN}${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2)}m`;
    if (amount >= 1_000) return `${NGN}${(amount / 1_000).toFixed(0)}k`;
  }
  return `${NGN}${amount.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

export function num(n: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
    if (n >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  }
  return n.toLocaleString('en-NG');
}

export function pct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function dateTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${shortDate(iso)} · ${hh}:${mm}`;
}

export function relative(iso: string, now = new Date('2026-11-05T09:30:00.000Z')): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return shortDate(iso);
}

export function truncMid(s: string, head = 6, tail = 4): string {
  if (s.length <= head + tail + 1) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

export function initials(name: string): string {
  return name
    .replace(/^(Dr|Prof|Mr|Mrs|Ms|Engr)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

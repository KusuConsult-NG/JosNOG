/** Deterministic PRNG so seeded demo data (and screenshots) are reproducible. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hex(rand: () => number, bytes: number): string {
  let s = '0x';
  for (let i = 0; i < bytes * 2; i += 1) s += '0123456789abcdef'[Math.floor(rand() * 16)];
  return s;
}

export function pick<T>(rand: () => number, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

export function intBetween(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/** Stable clock for the seeded dataset — keeps relative dates sensible. */
export const NOW = new Date('2026-11-05T09:30:00.000Z');

export function daysAgo(n: number, hour = 10): string {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(hour, (n * 7) % 60, 0, 0);
  return d.toISOString();
}

export function daysAhead(n: number): string {
  return daysAgo(-n);
}

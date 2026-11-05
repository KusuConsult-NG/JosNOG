'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ngn, num } from '@/lib/format';
import { AXIS_INK, GRID, SURFACE } from '@/lib/viz';

/**
 * Charts are client components, so they take a named formatter rather than a
 * function prop — server components cannot hand a closure across the boundary.
 */
export type FormatKey = 'num' | 'numCompact' | 'ngn' | 'ngnCompact';

const FORMATTERS: Record<FormatKey, (n: number) => string> = {
  num: (n) => num(n),
  numCompact: (n) => num(n, { compact: true }),
  ngn: (n) => ngn(n),
  ngnCompact: (n) => ngn(n, { compact: true }),
};

/* ------------------------------------------------------------------ */
/* shared plumbing                                                     */
/* ------------------------------------------------------------------ */

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(680);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.round(entry.contentRect.width);
      if (next > 0) setW(next);
    });
    ro.observe(el);
    setW(Math.round(el.getBoundingClientRect().width) || 680);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export interface Series {
  key: string;
  label: string;
  color: string;
  values: number[];
}

function Legend({ series }: { series: Series[] }) {
  if (series.length < 2) return null; // one series is named by the title
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5 text-[12px] text-ink-600">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function TableView({
  labels, series, fmt, caption,
}: { labels: string[]; series: Series[]; fmt: (n: number) => string; caption: string }) {
  return (
    <div className="scroll-thin mt-3 max-h-64 overflow-auto rounded-lg border border-ink-200">
      <table className="w-full border-collapse text-[12.5px]">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-ink-50 text-left text-ink-600">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Period</th>
            {series.map((s) => (
              <th key={s.key} scope="col" className="px-3 py-2 text-right font-semibold">{s.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((l, i) => (
            <tr key={l} className="border-t border-ink-100">
              <th scope="row" className="px-3 py-1.5 text-left font-medium text-ink-700">{l}</th>
              {series.map((s) => (
                <td key={s.key} className="px-3 py-1.5 text-right tabular-nums text-ink-700">{fmt(s.values[i] ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ViewToggle({ showTable, onToggle }: { showTable: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-md border border-ink-200 px-2 py-1 text-[11.5px] font-semibold text-ink-600 transition hover:bg-ink-50"
      aria-pressed={showTable}
    >
      {showTable ? 'Show chart' : 'Show table'}
    </button>
  );
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * mag >= v) ?? 10;
  return step * mag;
}

/* ------------------------------------------------------------------ */
/* Line chart — change over time, crosshair + shared tooltip           */
/* ------------------------------------------------------------------ */

export function LineChart({
  labels, series, height = 230, format = 'num', yLabel, caption,
}: {
  labels: string[];
  series: Series[];
  height?: number;
  format?: FormatKey;
  yLabel?: string;
  caption: string;
}) {
  const fmt = FORMATTERS[format];
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);

  const pad = { t: 12, r: 16, b: 26, l: 48 };
  const iw = Math.max(80, w - pad.l - pad.r);
  const ih = height - pad.t - pad.b;
  const max = useMemo(() => niceMax(Math.max(...series.flatMap((s) => s.values), 1) * 1.08), [series]);
  const x = (i: number) => pad.l + (labels.length <= 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  return (
    <div>
      <div className="flex items-center justify-end">
        <ViewToggle showTable={table} onToggle={() => setTable((t) => !t)} />
      </div>
      {table ? (
        <TableView labels={labels} series={series} fmt={fmt} caption={caption} />
      ) : (
        <div ref={ref} className="relative mt-1">
          <svg width={w} height={height} role="img" aria-label={caption}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={pad.l + iw} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
                <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="10.5" fill={AXIS_INK}>
                  {fmt(t)}
                </text>
              </g>
            ))}
            {labels.map((l, i) => (
              <text key={l} x={x(i)} y={height - 8} textAnchor="middle" fontSize="10.5" fill={AXIS_INK}>
                {l}
              </text>
            ))}
            {yLabel ? (
              <text x={pad.l - 38} y={pad.t - 2} fontSize="10" fill={AXIS_INK}>{yLabel}</text>
            ) : null}

            {hover !== null ? (
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="#BCC7C2" strokeWidth="1" strokeDasharray="3 3" />
            ) : null}

            {series.map((s) => (
              <g key={s.key}>
                <path
                  d={s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')}
                  fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
                {/* last point is directly labelled; intermediate points stay bare */}
                <circle cx={x(s.values.length - 1)} cy={y(s.values[s.values.length - 1])} r="4"
                        fill={s.color} stroke={SURFACE} strokeWidth="2" />
              </g>
            ))}

            {hover !== null
              ? series.map((s) => (
                  <circle key={s.key} cx={x(hover)} cy={y(s.values[hover])} r="4.5"
                          fill={s.color} stroke={SURFACE} strokeWidth="2" />
                ))
              : null}

            {labels.map((l, i) => (
              <rect
                key={l}
                x={x(i) - iw / Math.max(1, labels.length) / 2}
                y={pad.t}
                width={iw / Math.max(1, labels.length)}
                height={ih}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>

          {hover !== null ? (
            <div
              className="pointer-events-none absolute z-10 min-w-[150px] rounded-lg border border-ink-200 bg-white p-2.5 shadow-pop"
              style={{
                left: Math.min(Math.max(x(hover) - 75, 0), Math.max(0, w - 160)),
                top: 4,
              }}
            >
              <p className="text-[11.5px] font-semibold text-ink-900">{labels[hover]}</p>
              <ul className="mt-1 space-y-0.5">
                {series.map((s) => (
                  <li key={s.key} className="flex items-center justify-between gap-3 text-[11.5px]">
                    <span className="flex items-center gap-1.5 text-ink-600">
                      <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />
                      {s.label}
                    </span>
                    <span className="font-semibold tabular-nums text-ink-900">{fmt(s.values[hover])}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Legend series={series} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked bars — composition over time, 2px surface gaps              */
/* ------------------------------------------------------------------ */

export function StackedBars({
  labels, series, height = 230, format = 'num', caption,
}: {
  labels: string[];
  series: Series[];
  height?: number;
  format?: FormatKey;
  caption: string;
}) {
  const fmt = FORMATTERS[format];
  const [ref, w] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);

  const pad = { t: 12, r: 12, b: 26, l: 48 };
  const iw = Math.max(80, w - pad.l - pad.r);
  const ih = height - pad.t - pad.b;
  const totals = labels.map((_, i) => series.reduce((n, s) => n + (s.values[i] ?? 0), 0));
  const max = niceMax(Math.max(...totals, 1) * 1.08);
  const band = iw / labels.length;
  const barW = Math.min(44, band * 0.58);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  return (
    <div>
      <div className="flex items-center justify-end">
        <ViewToggle showTable={table} onToggle={() => setTable((t) => !t)} />
      </div>
      {table ? (
        <TableView labels={labels} series={series} fmt={fmt} caption={caption} />
      ) : (
        <div ref={ref} className="relative mt-1">
          <svg width={w} height={height} role="img" aria-label={caption}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={pad.l + iw} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
                <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="10.5" fill={AXIS_INK}>{fmt(t)}</text>
              </g>
            ))}
            {labels.map((l, i) => {
              const cx = pad.l + band * i + band / 2;
              let acc = 0;
              return (
                <g key={l}>
                  {series.map((s, si) => {
                    const v = s.values[i] ?? 0;
                    const y0 = y(acc);
                    acc += v;
                    const y1 = y(acc);
                    const isTop = si === series.length - 1;
                    const gap = si === 0 ? 0 : 2; // 2px surface gap between segments
                    const h = Math.max(0, y0 - y1 - gap);
                    return (
                      <rect
                        key={s.key}
                        x={cx - barW / 2}
                        y={y1}
                        width={barW}
                        height={h}
                        rx={isTop ? 4 : 0}
                        fill={s.color}
                        opacity={hover === null || hover === i ? 1 : 0.42}
                      />
                    );
                  })}
                  <text x={cx} y={height - 8} textAnchor="middle" fontSize="10.5" fill={AXIS_INK}>{l}</text>
                  <rect
                    x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent"
                    onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
          </svg>
          {hover !== null ? (
            <div
              className="pointer-events-none absolute z-10 min-w-[160px] rounded-lg border border-ink-200 bg-white p-2.5 shadow-pop"
              style={{ left: Math.min(Math.max(pad.l + band * hover - 60, 0), Math.max(0, w - 170)), top: 4 }}
            >
              <p className="text-[11.5px] font-semibold text-ink-900">{labels[hover]}</p>
              <ul className="mt-1 space-y-0.5">
                {series.map((s) => (
                  <li key={s.key} className="flex items-center justify-between gap-3 text-[11.5px]">
                    <span className="flex items-center gap-1.5 text-ink-600">
                      <span className="h-2 w-2 rounded-sm" style={{ background: s.color }} />{s.label}
                    </span>
                    <span className="font-semibold tabular-nums text-ink-900">{fmt(s.values[hover] ?? 0)}</span>
                  </li>
                ))}
                <li className="mt-1 flex items-center justify-between gap-3 border-t border-ink-100 pt-1 text-[11.5px]">
                  <span className="text-ink-600">Total</span>
                  <span className="font-semibold tabular-nums text-ink-900">{fmt(totals[hover])}</span>
                </li>
              </ul>
            </div>
          ) : null}
          <Legend series={series} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Horizontal bars — ranked magnitude, direct value labels             */
/* ------------------------------------------------------------------ */

export function BarsH({
  rows, color, format = 'num', caption,
}: {
  rows: { label: string; value: number; note?: string }[];
  color: string;
  format?: FormatKey;
  caption: string;
}) {
  const fmt = FORMATTERS[format];
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-2.5" aria-label={caption}>
      {rows.map((r) => (
        <li key={r.label} className="group">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-[13px] text-ink-700" title={r.label}>{r.label}</span>
            <span className="shrink-0 text-[12.5px] font-semibold tabular-nums text-ink-900">{fmt(r.value)}</span>
          </div>
          <div className="mt-1 h-2.5 w-full rounded-full bg-ink-100" title={`${r.label}: ${fmt(r.value)}`}>
            <div
              className="h-full rounded-r-[4px] transition-opacity group-hover:opacity-85"
              style={{ width: `${Math.max(1.5, (r.value / max) * 100)}%`, background: color }}
            />
          </div>
          {r.note ? <p className="mt-0.5 text-[11.5px] text-ink-400">{r.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Avatar } from './ui';
import { ROLE_LABEL, type SessionUser } from '@/lib/types';

export function TopBar({ user, title, subtitle }: { user: SessionUser; title: string; subtitle?: string }) {
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[19px] font-semibold tracking-tight text-ink-900">{title}</h1>
          {subtitle ? <p className="mt-0.5 truncate text-[12.5px] text-ink-500">{subtitle}</p> : null}
        </div>

        <label className="relative hidden xl:block">
          <span className="sr-only">Search the platform</span>
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" width="16" height="16"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4 4" />
          </svg>
          <input
            type="search" placeholder="Search courses, learners, TX hash…"
            className="field w-[300px] py-2 pl-9 text-[13px]"
          />
        </label>

        <span className="hidden items-center gap-1.5 rounded-full bg-nitda-50 px-2.5 py-1 text-[11.5px] font-semibold text-nitda-700 ring-1 ring-inset ring-nitda-200 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
          Polygon PoS · live
        </span>

        <div className="relative">
          <button
            type="button" onClick={() => setMenu((m) => !m)}
            className="flex items-center gap-2.5 rounded-lg border border-ink-200 px-2 py-1.5 text-left transition hover:bg-ink-50"
            aria-expanded={menu} aria-haspopup="menu"
          >
            <Avatar name={user.name} size={32} />
            <span className="hidden leading-tight sm:block">
              <span className="block text-[13px] font-semibold text-ink-900">{user.name}</span>
              <span className="block text-[11px] text-ink-500">{ROLE_LABEL[user.role]}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-400" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {menu ? (
            <div role="menu" className="absolute right-0 top-full z-40 mt-2 w-[268px] rounded-xl border border-ink-200 bg-white p-2 shadow-pop">
              <div className="rounded-lg bg-ink-50 px-3 py-2.5">
                <p className="text-[13px] font-semibold text-ink-900">{user.name}</p>
                <p className="truncate text-[12px] text-ink-500">{user.email}</p>
                <p className="mt-1 truncate text-[11.5px] text-ink-500">{user.mda}</p>
                {user.walletAddress ? (
                  <p className="mt-1.5 truncate font-mono text-[11px] text-nitda-700">{user.walletAddress}</p>
                ) : (
                  <p className="mt-1.5 text-[11.5px] text-gold-700">No wallet linked</p>
                )}
              </div>
              <Link href="/learn/credentials" role="menuitem" className="mt-1 block rounded-lg px-3 py-2 text-[13px] text-ink-700 hover:bg-ink-50">
                My credentials
              </Link>
              <Link href="/account" role="menuitem" className="block rounded-lg px-3 py-2 text-[13px] text-ink-700 hover:bg-ink-50">
                Account & security
              </Link>
              <form action="/api/auth/logout" method="post">
                <button type="submit" role="menuitem" className="mt-1 w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-rose-700 hover:bg-rose-50">
                  Sign out
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

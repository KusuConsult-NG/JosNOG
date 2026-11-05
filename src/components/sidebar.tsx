'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { EduTrustLockup, NitdaLockup } from './brand';
import { Icon } from './icons';
import { NAV } from './nav';
import type { Role } from '@/lib/types';

export function Sidebar({ role, qaCount }: { role: Role; qaCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = NAV[role];

  const body = (
    <nav className="flex h-full flex-col bg-nitda-800 text-nitda-100" aria-label="Primary">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <EduTrustLockup reverse size={34} href={`/${role === 'learner' ? 'learn' : role === 'admin' ? 'admin' : role === 'instructor' ? 'studio' : 'review'}`} />
        <button
          type="button" onClick={() => setOpen(false)}
          className="rounded-md p-1 text-white/70 hover:bg-white/10 lg:hidden"
          aria-label="Close navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <div className="scroll-thin flex-1 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.group} className="mb-5">
            <p className="px-2.5 pb-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-nitda-300/80">
              {g.group}
            </p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition ${
                        active
                          ? 'bg-accent-500 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)]'
                          : 'text-nitda-100/85 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon name={item.icon} size={17} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge === 'qa' && qaCount > 0 ? (
                        <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-ink-900">
                          {qaCount}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <NitdaLockup reverse size={34} />
        <p className="mt-3 text-[10.5px] leading-snug text-nitda-200/70">
          © {new Date().getFullYear()} National Information Technology Development Agency.
          Presented at the JosNOG Workshop.
        </p>
      </div>
    </nav>
  );

  return (
    <>
      <button
        type="button" onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-nitda-600 p-3.5 text-white shadow-pop lg:hidden"
        aria-label="Open navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      <aside className="sticky top-0 hidden h-screen w-[262px] shrink-0 lg:block">{body}</aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px]">{body}</div>
        </div>
      ) : null}
    </>
  );
}

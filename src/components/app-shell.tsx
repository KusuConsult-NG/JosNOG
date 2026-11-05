import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getSession, HOME_FOR } from '@/lib/auth';
import { coursesAwaitingQa } from '@/lib/store';
import type { Role, SessionUser } from '@/lib/types';
import { GovBand } from './brand';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

export async function requireUser(allow?: Role[]): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect('/login');
  if (allow && !allow.includes(user.role)) redirect(HOME_FOR[user.role]);
  return user;
}

export async function AppShell({
  allow, title, subtitle, children,
}: {
  allow?: Role[];
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const user = await requireUser(allow);
  const qaCount = coursesAwaitingQa().length;

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar role={user.role} qaCount={qaCount} />
        <div className="flex min-w-0 flex-1 flex-col">
          <GovBand />
          <TopBar user={user} title={title} subtitle={subtitle} />
          <main id="main" className="flex-1 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-[1280px] animate-fade-up">{children}</div>
          </main>
          <footer className="border-t border-ink-200 bg-white px-4 py-4 text-[11.5px] text-ink-500 sm:px-6">
            <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2">
              <span>
                EduTrust-Chain v1.0 · National Information Technology Development Agency ·
                NDPA/NDPR-compliant processing
              </span>
              <span>Credential registry: Polygon PoS · Settlement: eNaira → TSA</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

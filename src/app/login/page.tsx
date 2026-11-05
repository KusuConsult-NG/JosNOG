import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthBrandPanel } from '@/components/auth-brand-panel';
import { EduTrustLockup, GovBand, NitdaEmblem } from '@/components/brand';
import { SignInForm } from '@/components/signin-form';
import { getSession, HOME_FOR } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to EduTrust-Chain, the NITDA AI-assisted blockchain learning platform.',
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(HOME_FOR[session.role]);

  return (
    <div className="flex min-h-screen flex-col">
      <GovBand />
      <div className="flex flex-1">
        <AuthBrandPanel />

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-10">
            <EduTrustLockup size={38} />
            <span className="flex items-center gap-2 lg:hidden">
              <NitdaEmblem size={34} />
              <span className="text-[10.5px] font-semibold leading-tight text-ink-500">
                National Information<br />Technology Development Agency
              </span>
            </span>
            <Link href="/verify" className="hidden text-[12.5px] font-semibold text-nitda-600 hover:underline lg:block">
              Verify a certificate →
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 pb-8 sm:px-10">
            <div className="w-full max-w-[440px]">
              <h1 className="text-[26px] font-bold tracking-tight text-ink-900">Sign in to EduTrust-Chain</h1>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">
                Use your NITDA work email, the agency single sign-on, or a linked Web3 wallet.
                Access is logged for audit under the Nigeria Data Protection Act.
              </p>

              <div className="mt-7">
                <SignInForm />
              </div>

              <div className="mt-8 border-t border-ink-200 pt-5">
                <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-ink-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                       className="mt-0.5 shrink-0" aria-hidden="true">
                    <rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  Protected by TLS 1.3, AES-256 encryption at rest and mandatory two-factor
                  authentication for staff accounts. Unauthorised access is an offence under the
                  Cybercrimes (Prohibition, Prevention etc.) Act 2015.
                </p>
                <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-ink-500" aria-label="Legal">
                  <Link href="/legal/privacy" className="hover:text-nitda-600 hover:underline">NDPR privacy notice</Link>
                  <Link href="/legal/terms" className="hover:text-nitda-600 hover:underline">Terms of use</Link>
                  <Link href="/legal/accessibility" className="hover:text-nitda-600 hover:underline">Accessibility</Link>
                  <Link href="/verify" className="hover:text-nitda-600 hover:underline">Public verification</Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

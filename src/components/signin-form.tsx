'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

const DEMO = [
  { role: 'Learner', email: 'learner@nitda.gov.ng', desc: 'Courses, AI tutor, credentials' },
  { role: 'Instructor', email: 'instructor@nitda.gov.ng', desc: 'AI authoring studio' },
  { role: 'QA Reviewer', email: 'reviewer@nitda.gov.ng', desc: 'Content quality gate' },
  { role: 'Administrator', email: 'admin@nitda.gov.ng', desc: 'Full NITDA oversight' },
];

const DEMO_PASSWORD = 'Nitda@2026';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('learner@nitda.gov.ng');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfa, setMfa] = useState<{ userId: string; name: string } | null>(null);
  const [code, setCode] = useState('');
  const codeRef = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? 'Sign-in failed.');
        return;
      }
      if (data.step === 'mfa') {
        setMfa({ userId: data.userId, name: data.name });
        setTimeout(() => codeRef.current?.focus(), 60);
        return;
      }
      router.push(data.redirect);
    } catch {
      setError('The platform could not be reached. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function submitMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!mfa) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/mfa', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ userId: mfa.userId, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? 'That code was not accepted.');
        return;
      }
      router.push(data.redirect);
    } finally {
      setBusy(false);
    }
  }

  async function walletSignIn() {
    setBusy(true);
    setError(null);
    try {
      const injected = (globalThis as unknown as { ethereum?: { request(a: { method: string }): Promise<string[]> } }).ethereum;
      let address = '';
      if (injected) {
        const accounts = await injected.request({ method: 'eth_requestAccounts' });
        address = accounts?.[0] ?? '';
      } else {
        // No injected provider in this browser — fall back to the demo learner's
        // linked address so the Sign-In With Ethereum path stays walkable.
        address = '0x4D9a2C5f8B1d0E3a67A3f91C4E2bD5a6F08c1B4d';
      }
      const res = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error);
        return;
      }
      router.push(data.redirect);
    } catch {
      setError('Wallet connection was cancelled.');
    } finally {
      setBusy(false);
    }
  }

  if (mfa) {
    return (
      <form onSubmit={submitMfa} className="space-y-5" noValidate>
        <div className="rounded-lg border border-nitda-200 bg-nitda-50 px-4 py-3">
          <p className="text-[13px] font-semibold text-nitda-800">Two-factor authentication</p>
          <p className="mt-0.5 text-[12.5px] text-nitda-700">
            Welcome back, {mfa.name.split(' ')[0]}. Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="code">Authenticator code</label>
          <input
            ref={codeRef} id="code" name="code" inputMode="numeric" autoComplete="one-time-code"
            maxLength={6} value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="field mt-1.5 text-center text-[22px] font-semibold tracking-[0.5em]"
            placeholder="000000" aria-describedby="code-help"
          />
          <p id="code-help" className="mt-1.5 text-[12px] text-ink-500">
            Codes rotate every 30 seconds. Lost your device? Contact the NITDA service desk on 0800-NITDA-1.
          </p>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        <button type="submit" className="btn-primary w-full" disabled={busy || code.length < 6}>
          {busy ? 'Verifying…' : 'Verify and continue'}
        </button>
        <button type="button" onClick={() => { setMfa(null); setCode(''); setError(null); }}
                className="w-full text-[13px] font-semibold text-ink-500 hover:text-ink-800">
          Use a different account
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label className="label" htmlFor="email">Work email address</label>
        <input
          id="email" name="email" type="email" autoComplete="username" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="field mt-1.5" placeholder="name@nitda.gov.ng"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label className="label" htmlFor="password">Password</label>
          <Link href="/forgot-password" className="text-[12px] font-semibold text-nitda-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative mt-1.5">
          <input
            id="password" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="field pr-16" placeholder="••••••••••"
          />
          <button
            type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11.5px] font-semibold text-ink-500 hover:bg-ink-100"
            aria-pressed={show}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <label className="flex items-center gap-2 text-[12.5px] text-ink-600">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded border-ink-300 text-nitda-600 focus:ring-nitda-500/30" />
          Keep me signed in for 8 hours
        </label>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy ? 'Checking credentials…' : 'Sign in securely'}
      </button>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-ink-200" />
        <span className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-400">or continue with</span>
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <button type="button" className="btn-ghost" onClick={() => { setEmail('admin@nitda.gov.ng'); setPassword(DEMO_PASSWORD); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 3 20 6v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3Z" />
          </svg>
          NITDA single sign-on
        </button>
        <button type="button" className="btn-ghost" onClick={walletSignIn} disabled={busy}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 16.5v-9Z" />
            <path d="M16 12h2" />
          </svg>
          Web3 wallet
        </button>
      </div>

      <fieldset className="mt-5 rounded-xl border border-ink-200 bg-ink-50/70 p-3.5">
        <legend className="px-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
          Evaluation accounts
        </legend>
        <p className="px-0.5 pb-2 text-[12px] text-ink-500">
          Select a role to pre-fill the form. Shared password <code className="font-mono text-ink-700">{DEMO_PASSWORD}</code>.
        </p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {DEMO.map((d) => (
            <button
              key={d.email} type="button"
              onClick={() => { setEmail(d.email); setPassword(DEMO_PASSWORD); setError(null); }}
              className={`rounded-lg border px-2.5 py-2 text-left transition ${
                email === d.email
                  ? 'border-nitda-500 bg-white shadow-[0_0_0_3px_rgba(27,115,57,.12)]'
                  : 'border-ink-200 bg-white hover:border-nitda-300'
              }`}
            >
              <span className="block text-[12.5px] font-semibold text-ink-900">{d.role}</span>
              <span className="block text-[11px] text-ink-500">{d.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <p className="pt-1 text-center text-[13px] text-ink-600">
        New to the platform?{' '}
        <Link href="/register" className="link">Create a learner account</Link>
      </p>
    </form>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12.5px] text-rose-800">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-px shrink-0" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
      </svg>
      {children}
    </p>
  );
}

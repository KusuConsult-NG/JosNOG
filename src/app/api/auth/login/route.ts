import { NextResponse } from 'next/server';
import { createSession, HOME_FOR, verifyCredentials } from '@/lib/auth';
import { audit, findUserByEmail } from '@/lib/store';

/**
 * Step 1 of sign-in: credential verification.
 *
 * On success, accounts with MFA enrolled receive a challenge rather than a
 * session cookie; the cookie is only issued once /api/auth/mfa succeeds.
 * (PRD §4.0 / §6.1 — MFA is mandatory for instructor, reviewer and admin.)
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = (body.email ?? '').trim();
  const password = body.password ?? '';

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'Enter your email address and password.' }, { status: 400 });
  }

  const user = verifyCredentials(email, password);

  if (!user) {
    const known = findUserByEmail(email);
    audit({
      actorId: known?.id ?? 'anonymous',
      actorName: known?.name ?? email,
      action: 'auth.login_failed',
      target: email,
      ip: request.headers.get('x-forwarded-for') ?? '0.0.0.0',
      severity: 'warning',
    });
    const reason = known && known.status !== 'active'
      ? 'This account is not active. Contact the NITDA platform administrator.'
      : 'Those credentials do not match an EduTrust-Chain account.';
    return NextResponse.json({ ok: false, error: reason }, { status: 401 });
  }

  if (user.mfaEnabled) {
    return NextResponse.json({
      ok: true,
      step: 'mfa',
      userId: user.id,
      name: user.name,
      hint: 'Enter the 6-digit code from your authenticator app.',
    });
  }

  await createSession(user.id);
  audit({
    actorId: user.id, actorName: user.name, action: 'auth.login',
    target: `${user.role} session`, ip: request.headers.get('x-forwarded-for') ?? '0.0.0.0', severity: 'info',
  });
  return NextResponse.json({ ok: true, step: 'done', redirect: HOME_FOR[user.role] });
}

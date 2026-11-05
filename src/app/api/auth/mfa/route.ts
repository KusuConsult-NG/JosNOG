import { NextResponse } from 'next/server';
import { createSession, HOME_FOR } from '@/lib/auth';
import { audit, findUser } from '@/lib/store';

/**
 * Step 2 of sign-in: TOTP verification.
 *
 * The reference build accepts any 6-digit code so the platform is walkable
 * without enrolling a real authenticator. Production replaces the check below
 * with an RFC 6238 verify against the user's encrypted TOTP secret plus a
 * replay window — nothing else in the flow changes.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { userId?: string; code?: string };
  const user = body.userId ? findUser(body.userId) : undefined;
  const code = (body.code ?? '').replace(/\D/g, '');

  if (!user) {
    return NextResponse.json({ ok: false, error: 'Your sign-in session expired. Please start again.' }, { status: 400 });
  }
  if (code.length !== 6) {
    return NextResponse.json({ ok: false, error: 'Enter the full 6-digit authenticator code.' }, { status: 400 });
  }

  await createSession(user.id);
  audit({
    actorId: user.id, actorName: user.name, action: 'auth.login_mfa',
    target: `${user.role} session`, ip: request.headers.get('x-forwarded-for') ?? '0.0.0.0', severity: 'info',
  });
  return NextResponse.json({ ok: true, redirect: HOME_FOR[user.role] });
}

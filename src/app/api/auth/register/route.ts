import { NextResponse } from 'next/server';
import { createSession, HOME_FOR } from '@/lib/auth';
import { audit, createUser, findUserByEmail } from '@/lib/store';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, string | boolean | undefined>;
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');
  const mda = String(body.mda ?? '').trim();
  const state = String(body.state ?? '').trim();
  const consent = body.consent === true || body.consent === 'true';

  if (!name || !email || !password || !mda || !state) {
    return NextResponse.json({ ok: false, error: 'All fields are required.' }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 10) {
    return NextResponse.json({ ok: false, error: 'Use at least 10 characters, mixing letters, numbers and a symbol.' }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ ok: false, error: 'You must accept the NDPR data-processing notice to continue.' }, { status: 400 });
  }
  if (findUserByEmail(email)) {
    return NextResponse.json({ ok: false, error: 'An account already exists for that email address.' }, { status: 409 });
  }

  const user = createUser({ name, email, password, mda, state });
  audit({
    actorId: user.id, actorName: user.name, action: 'user.registered',
    target: `${user.email} (${mda})`, ip: request.headers.get('x-forwarded-for') ?? '0.0.0.0', severity: 'info',
  });
  await createSession(user.id);
  return NextResponse.json({ ok: true, redirect: HOME_FOR[user.role] });
}

import { NextResponse } from 'next/server';
import { destroySession, getSession } from '@/lib/auth';
import { audit } from '@/lib/store';

export async function POST(request: Request) {
  const user = await getSession();
  if (user) {
    audit({
      actorId: user.id, actorName: user.name, action: 'auth.logout', target: 'session',
      ip: request.headers.get('x-forwarded-for') ?? '0.0.0.0', severity: 'info',
    });
  }
  await destroySession();
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
}

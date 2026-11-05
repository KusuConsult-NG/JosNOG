import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { findUser, findUserByEmail } from './store';
import type { Role, SessionUser, User } from './types';

export const SESSION_COOKIE = 'etc_session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8h — PRD §6.1 session policy

/**
 * Stateless signed-cookie sessions (HMAC-SHA256).
 *
 * Production swaps this for the agency SSO bridge (SAML/OIDC against NITDA
 * Active Directory) plus a Redis-backed revocation list; the exported surface
 * — getSession / createSession / destroySession — stays identical.
 */
function secret(): string {
  return process.env.SESSION_SECRET ?? 'edutrust-chain-dev-secret-do-not-use-in-production';
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function encodeToken(userId: string): string {
  const body = Buffer.from(JSON.stringify({ sub: userId, iat: Date.now() })).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function decodeToken(token: string | undefined): string | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig || !safeEqual(sig, sign(body))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString()) as { sub: string; iat: number };
    if (Date.now() - parsed.iat > MAX_AGE_SECONDS * 1000) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}

export function toSessionUser(u: User): SessionUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role, mda: u.mda, walletAddress: u.walletAddress };
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const id = decodeToken(jar.get(SESSION_COOKIE)?.value);
  if (!id) return null;
  const user = findUser(id);
  return user ? toSessionUser(user) : null;
}

export async function createSession(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Constant-time-ish credential check. Production: Argon2id verify. */
export function verifyCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (!safeEqual(user.password, password)) return null;
  if (user.status !== 'active') return null;
  return user;
}

export const HOME_FOR: Record<Role, string> = {
  learner: '/learn',
  instructor: '/studio',
  reviewer: '/review',
  admin: '/admin',
};

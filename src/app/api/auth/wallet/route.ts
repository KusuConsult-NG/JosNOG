import { NextResponse } from 'next/server';
import { createSession, HOME_FOR } from '@/lib/auth';
import { audit, db, findUser } from '@/lib/store';

/**
 * Web3 sign-in (EIP-4361 "Sign-In With Ethereum").
 *
 * The browser asks the injected provider (MetaMask / WalletConnect) to sign the
 * SIWE statement; this endpoint matches the recovered address to an account.
 * The reference build trusts the posted address so the flow is walkable without
 * a wallet extension — production verifies the signature with `personal_ecRecover`
 * before any session is issued. See docs/ARCHITECTURE.md §Wallet sign-in.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { address?: string; link?: string };
  const address = (body.address ?? '').trim();

  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ ok: false, error: 'That is not a valid wallet address.' }, { status: 400 });
  }

  // Link mode: attach the wallet to the signed-in account.
  if (body.link) {
    const user = findUser(body.link);
    if (!user) return NextResponse.json({ ok: false, error: 'Account not found.' }, { status: 404 });
    user.walletAddress = address;
    audit({ actorId: user.id, actorName: user.name, action: 'wallet.linked', target: address, ip: '0.0.0.0', severity: 'notice' });
    return NextResponse.json({ ok: true, walletAddress: address });
  }

  const match = db.users.find((u) => u.walletAddress?.toLowerCase() === address.toLowerCase());
  if (!match) {
    return NextResponse.json({
      ok: false,
      error: 'No EduTrust-Chain account is linked to that wallet. Sign in with your email, then link the wallet from Account & security.',
    }, { status: 404 });
  }

  await createSession(match.id);
  audit({ actorId: match.id, actorName: match.name, action: 'auth.login_siwe', target: address, ip: '0.0.0.0', severity: 'info' });
  return NextResponse.json({ ok: true, redirect: HOME_FOR[match.role] });
}

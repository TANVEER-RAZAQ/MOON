import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE = '__admin_gate';

function gateToken(user: string, pass: string) {
  return Buffer.from(`${user}:${pass}`).toString('base64');
}

function isConfigured() {
  const pass = process.env.ADMIN_BASIC_AUTH_PASS ?? '';
  return !!(process.env.ADMIN_BASIC_AUTH_USER && pass && pass !== 'change-me-in-production');
}

export async function proxyGuard() {
  if (!isConfigured()) return;

  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  const expected = gateToken(
    process.env.ADMIN_BASIC_AUTH_USER!,
    process.env.ADMIN_BASIC_AUTH_PASS!
  );

  if (token === expected) return;

  redirect('/api/basic-auth');
}

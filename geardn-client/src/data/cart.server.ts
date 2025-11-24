import { headers } from 'next/headers';
export async function getCartOnServer() {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/carts`, { headers:{ cookie: h.get('cookie') ?? '', accept:'application/json' }, cache:'no-store' });
  if (!r.ok) return null;
  return r.json();
}

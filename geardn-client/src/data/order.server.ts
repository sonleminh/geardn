import { IOrder } from '@/interfaces/IOrder';
import { BaseResponse } from '@/types/response.type';
import { headers } from 'next/headers';


export async function getOrderConfirm(code: string) {
  const h = await headers();
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const r = await fetch(`${origin}/api/bff/orders/${encodeURIComponent(code)}`, {
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
    cache: 'no-store',               
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`Order fetch failed: ${r.status}`);
  return r.json() as Promise<BaseResponse<IOrder>>; 
}
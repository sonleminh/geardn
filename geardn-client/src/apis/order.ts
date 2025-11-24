import { OrderStatus } from "@/constants/orderStatus";
import { ICreateOrderPayload, IOrder } from "@/interfaces/IOrder";
import { BaseResponse } from "@/types/response.type";

type OrdersMeta = {
  countsByStatus: Record<OrderStatus, number>;
  totalsByStatus: Record<OrderStatus, number>;
  overall: { count: number; sum: number };
};


export async function createOrder(payload: ICreateOrderPayload) {
  const res = await fetch('/api/bff/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Create order failed');
  return data as BaseResponse<IOrder>;
}

export async function getUserPurchases(params: { type?: number } = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== 0) qs.set(k, String(v));
  }
  const url = `/api/bff/orders/user-purchases${qs.toString() ? `?${qs}` : ''}`;
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(String(r.status));
  return r.json() as Promise<BaseResponse<IOrder[], OrdersMeta>>;
}
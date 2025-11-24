import { IUser } from "@/interfaces/IUser";
import { BaseResponse } from "@/types/response.type";
import { headers } from "next/headers";

export async function getUserOnServer() {
  const h = await headers();
  const cookie = h.get('cookie') ?? '';
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}/api/bff/auth/whoami`, {
    headers: { cookie, accept: 'application/json' },
    cache: 'no-store',
  });
  
    if (!res.ok) return null;
    return res.json() as Promise<BaseResponse<IUser>>;
  }
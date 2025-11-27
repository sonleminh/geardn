import { IUser } from "@/interfaces/IUser";
import { getBackendBaseUrl } from "@/lib/backend-config";
import { BaseResponse } from "@/types/response.type";
import { headers } from "next/headers";

export async function getUserOnServer() {
  const h = await headers();
  console.log('User Agent:', h.get('user-agent'));

  const cookie = h.get('cookie') ?? '';

  const backendBaseUrl = getBackendBaseUrl();

  console.log('cookie', cookie)
  console.log('backendBaseUrl', backendBaseUrl)


  try {
    const res = await fetch(`${backendBaseUrl}/auth/whoami`, {
      headers: { 
        cookie,
        accept: 'application/json',
        // Giả lập user-agent để backend không chặn
        'user-agent': h.get('user-agent') ?? 'NextJS-Server-Component'
      },
      cache: 'no-store',
    });

    console.log('res', res)

    if (!res.ok) {
        return null;
    }
    
    return res.json() as Promise<BaseResponse<IUser>>;
  } catch (error) {
    console.error("Error connecting to backend from server:", error);
    return null;
  }
}
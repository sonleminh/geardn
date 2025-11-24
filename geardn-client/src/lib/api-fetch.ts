import { AppError } from "./errors/app-error";

let refreshing: Promise<Response>|null = null;
const refreshOnce = () =>
  (refreshing ??= fetch('/api/bff/auth/refresh-token', { method:'GET', cache:'no-store' })
    .finally(()=> (refreshing=null)));

async function parseOk<T>(res: Response): Promise<T> {
  if (res.status === 204) return null as unknown as T;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  const text = await res.text();
  // Tùy dự án: nếu endpoint hợp lệ mà trả text thì ép kiểu tại đây
  return JSON.parse(text);
}

async function throwHttpError(res: Response): Promise<never> {
  const ct = res.headers.get('content-type') || '';
  let body = null;
  try {
    body = ct.includes('application/json') ? await res.json() : await res.text();
  } catch {}
  const message =
    (body && typeof body.message === 'string' && body.message) ||
    res.statusText ||
    'Request failed';
  throw new AppError(message, { status: res.status, details: body });
}

export async function bff<T>(input: string, init?: RequestInit): Promise<T> {
  const doFetch = () => fetch(input, { ...init, cache: 'no-store' });

  let r = await doFetch();
  if (r.status === 401) {
    const rf = await refreshOnce();
    if (!rf.ok) throw new AppError('Unauthorized', { status: rf.status });
    r = await doFetch();
  }

  if (!r.ok) await throwHttpError(r);
  return parseOk<T>(r);
}
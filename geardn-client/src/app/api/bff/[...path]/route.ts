import { NextRequest, NextResponse } from 'next/server';
import { splitCookiesString } from 'set-cookie-parser';

type NodeReadable = ReadableStream<Uint8Array>;

export const runtime = 'nodejs';

function getBackendBaseUrl() {
  const envUrl = process.env.BACKEND_API_URL;
  if (envUrl && envUrl.length > 0) return envUrl;

  if (process.env.NODE_ENV === 'production') {
    return 'http://geardn-server:8080/api'; // gọi service trong docker network
  }
  return 'http://localhost:8080/api';        // chạy dev ngoài docker
}

const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS ?? 8000);

// const BE =   process.env.BACKEND_API_URL ??
//   (process.env.NODE_ENV === 'production'
//     ? 'http://geardn-server:8080/api'   // chạy trong Docker
//     : 'http://localhost:8080/api'); 

const FORWARD_ALLOW = new Set(['authorization', 'user-agent', 'referer', 'accept-language', 'content-type']);

function buildForwardHeaders(req: NextRequest, extra?: HeadersInit) {
  const h = new Headers(extra ?? {});
  if (!h.has('accept')) h.set('accept', 'application/json');

  for (const k of FORWARD_ALLOW) {
    const v = req.headers.get(k);
    if (v && !h.has(k)) h.set(k, v);
  }

  const ck = req.headers.get('cookie');
  if (ck && !h.has('cookie')) h.set('cookie', ck);

  // x-forwarded-*
const chain = req.headers.get('x-forwarded-for');
const curIp =
  req.headers.get('x-real-ip') ??
  req.headers.get('cf-connecting-ip') ??
  '';

h.set('x-forwarded-for', chain ? `${chain}, ${curIp}` : curIp);
h.set('x-forwarded-proto', req.headers.get('x-forwarded-proto') ?? 'http');
h.set(
  'x-forwarded-host',
  req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? ''
);

  return h;
}

async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/bff\//, '');

  let body: BodyInit | undefined;
let duplex: 'half' | undefined;

  // Optional allowlist for query keys. Keep empty to allow all.
  // Example: const ALLOWED = new Set(['limit','sort','q'])
  const ALLOWED_VALUES = ['page', 'limit', 'sortBy', 'order', 'keyword', 'cursor', 'skuIds', 'type'] as string[];
  const ALLOWED: ReadonlySet<string> | null = new Set<string>(ALLOWED_VALUES);

const qs = new URLSearchParams();
for (const [k, v] of url.searchParams.entries()) {
if (v == null || v === '') continue;
if (ALLOWED !== null && !ALLOWED.has(k)) continue;
qs.set(k, v);
}
  const BE = getBackendBaseUrl();
  console.log('BFF → target BE:', BE, 'NODE_ENV:', process.env.NODE_ENV, 'BACKEND_API_URL:', process.env.BACKEND_API_URL);

  const target = `${BE}/${path}${qs.size ? `?${qs}` : ''}`;

  // const target = `${BE}/${path}${qs.size ? `?${qs}` : ''}`;
  const method = req.method;
  const headers = buildForwardHeaders(req);

  // Pass through body for non-GET/HEAD
  if (method !== 'GET' && method !== 'HEAD' && req.body) {
    body = req.body as unknown as NodeReadable; // tránh any
    duplex = 'half';                            // undici yêu cầu khi stream body
  }

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(target, {
      method,
      headers,
      body,
      cache: 'no-store',
      redirect: 'manual',
      signal: controller.signal,
      ...(duplex ? { duplex } : {}),  
    });
  } finally {
    clearTimeout(to);
  }

  // Copy status and headers
  const respHeaders = new Headers();

  // Pass through content-type and caching headers
  const pass = ['content-type', 'cache-control', 'expires', 'last-modified', 'etag', 'location'];
  for (const k of pass) {
    const v = res.headers.get(k);
    if (v) respHeaders.set(k, v);
  }

  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    try {
      const cookies = splitCookiesString(setCookie); // ensure `set-cookie-parser` is installed
      for (const c of cookies) respHeaders.append('set-cookie', c);
    } catch {
      // Fallback: single header
      respHeaders.append('set-cookie', setCookie);
    }
  }

  // Stream body through
  return new NextResponse(res.body, {
    status: res.status,
    headers: respHeaders,
  });
}

export async function GET(req: NextRequest) {
  return proxy(req);
}
export async function POST(req: NextRequest) {
  return proxy(req);
}
export async function PUT(req: NextRequest) {
  return proxy(req);
}
export async function PATCH(req: NextRequest) {
  return proxy(req);
}
export async function DELETE(req: NextRequest) {
  return proxy(req);
}

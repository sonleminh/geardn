export function buildUrl(base: string, path: string, params?: Record<string, string | number | boolean | undefined>) {
  if (!base) throw new Error('Missing base URL');
    const u = new URL(path.replace(/^\/+/, ''), base.endsWith('/') ? base : base + '/');
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === '') continue;
        if (Array.isArray(v)) {
          u.searchParams.delete(k);
          for (const item of v) u.searchParams.append(k, String(item));
        } else {
          u.searchParams.set(k, String(v));
        }
      }
    }
    return u;
  }
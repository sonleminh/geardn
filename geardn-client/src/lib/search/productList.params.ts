export type SortByKey = 'createdAt' | 'price';
export type OrderKey = 'asc' | 'desc';
export interface ProductListParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: SortByKey;
  order?: OrderKey;
  category?: string;
}

const SORTBY_WHITELIST: Record<string, SortByKey> = {
  createdAt: 'createdAt',
  price: 'price',
};

const ORDER_WHITELIST: Record<string, OrderKey> = {
  asc: 'asc',
  desc: 'desc',
};

function pick(input: Record<string, string | string[] | undefined>, k: string) {
  const v = input[k];
  return Array.isArray(v) ? v[0] : v;
}

function parseIntMaybe(v?: string): number | undefined {
  if (v == null || v.trim() === '') return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function parseProductListParams(
  input: Record<string, string | string[] | undefined>
): ProductListParams {
  const keyword = (pick(input, 'keyword') ?? '').trim() || undefined;

  const pageRaw = parseIntMaybe(pick(input, 'page'));
  const page = pageRaw && pageRaw > 0 ? pageRaw : undefined;

  const limitRaw = parseIntMaybe(pick(input, 'limit'));
  const limit = limitRaw && limitRaw > 0 ? limitRaw : undefined;

  const rawSortBy = (pick(input, 'sortBy') ?? '').toLowerCase();
  const sortBy = (SORTBY_WHITELIST[rawSortBy] as SortByKey | undefined) ?? undefined;

    const rawOrder = (pick(input, 'order') ?? '').toLowerCase();
  const order = (ORDER_WHITELIST[rawOrder] as OrderKey | undefined) ?? undefined;

  const category = (pick(input, 'category') ?? '').trim() || undefined;

  return { keyword, page, limit, sortBy, order, category };
}

export function toURLSearchParams(p: ProductListParams) {
  const qs = new URLSearchParams();
  if (p.keyword) qs.set('keyword', p.keyword);
  if (p.category) qs.set('category', p.category);
  if (p.sortBy) qs.set('sortBy', p.sortBy);
  if (p.order) qs.set('order', p.order);
  if (p.page && p.page > 1) qs.set('page', String(p.page));
  if (p.limit) qs.set('limit', String(p.limit));              
  return qs;
}

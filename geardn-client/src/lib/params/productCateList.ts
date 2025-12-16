export type SortBy = 'createdAt' | 'price';
export type Order = 'asc' | 'desc';

export type ProductListParams = {
  sortBy: SortBy;
  order: Order;
  limit: number;
  cursor?: string | null;
};

export function parseParams(
  input: Record<string, string | string[] | undefined>
): ProductListParams {
  const pick = (k: string): string | undefined => {
    const v = input[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const sortBy: SortBy = pick('sortBy') === 'price' ? 'price' : 'createdAt';
  const order: Order = pick('order') === 'asc' ? 'asc' : 'desc';
  const limit = Math.max(1, Math.min(60, Number(pick('limit') ?? '24') || 24));
  const cursor: string | null = pick('cursor') ?? null;

  return { sortBy, order, limit, cursor };
}

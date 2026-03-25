export const CacheKeys = {
  products: (
    page: number,
    limit: number,
    sortBy: 'createdAt' | 'price' | 'sold',
    order: 'asc' | 'desc',
  ) => `products:list:${page}:${limit}:${sortBy}:${order}`,

  productDetail: (id: number) => `products:detail:${id}`,

  categories: () => `categories:all`,
} as const;

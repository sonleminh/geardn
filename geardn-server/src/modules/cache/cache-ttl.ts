export const CacheTTL = {
  // Changes rarely — new products added infrequently
  HOMEPAGE_PRODUCTS: 10 * 60 * 1000, // 10 minutes

  // Almost never changes
  CATEGORIES: 60 * 60 * 1000, // 1 hour

  // Changes often — price, stock, visibility
  PRODUCT_DETAIL: 5 * 60 * 1000, // 5 minutes

  // Very sensitive — should be short or no cache
  PRODUCT_STOCK: 60 * 1000, // 1 minute
} as const;

// You can define this near your service or in a types file
type HomepageProductsResult = {
  data: Prisma.ProductGetPayload<{
    include: { category: { select: { id: true; name: true; slug: true } } };
  }>[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    sortBy: string | undefined;
    order: string;
  };
  message: string;
};

type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    category: true;
    skus: true;
  };
}>;

type CategoryProductsResult = {
  data: {
    id: number;
    name: string;
    slug: string;
    images: string[];
    priceMin: Decimal;
    priceMax: Decimal;
    createdAt: Date;
    category: { id: number; slug: string; name: string };
  }[];
  meta: {
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
    limit: number;
  };
  category: { id: number | undefined; slug: string; name: string | undefined };
  message: string;
};

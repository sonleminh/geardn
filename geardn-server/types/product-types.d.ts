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

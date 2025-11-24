import { Box } from '@mui/material';
import ProductByCategoryClient from './ProductByCategoryClient';
import { getProductsByCategory } from '@/data/product.server';
import {
  parseProductListParams,
  toURLSearchParams,
} from '@/lib/search/productList.params';

export default async function ProductByCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const resolvedParams = await searchParams;
  const parsed = parseProductListParams(resolvedParams);
  const qs = toURLSearchParams(parsed);
  const initial = await getProductsByCategory(category, qs);
  return (
    <Box sx={{ pt: 2, pb: 4, bgcolor: '#F3F4F6' }}>
      <ProductByCategoryClient
        slug={category}
        initial={initial}
        params={parsed}
      />
    </Box>
  );
}

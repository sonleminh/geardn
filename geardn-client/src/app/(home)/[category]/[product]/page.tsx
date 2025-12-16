import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/data/product.server';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;
  const res = await getProductBySlug(product);
  if (!res) notFound();

  return (
    <Box>
      <ProductDetailClient initialProduct={res} />
    </Box>
  );
}

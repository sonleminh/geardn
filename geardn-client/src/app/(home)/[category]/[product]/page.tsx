export const revalidate = 60;

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Box } from "@mui/material";
import ProductDetailClient from "./ProductDetailClient";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { getProductBySlug } from "@/services/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { product: productSlug } = await params;
  const res = await getProductBySlug(productSlug);
  if (!res) notFound();
  return (
    <Box sx={{ pb: { xs: 4, md: 8 } }}>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient data={res.data} />
      </Suspense>
    </Box>
  );
}

export const revalidate = 60;

import { Suspense } from "react";
import { Box } from "@mui/material";
import ProductDetailContainer from "./ProductDetailContainer";
import ProductDetailSkeleton from "./ProductDetailSkeleton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { product: productSlug } = await params;

  return (
    <Box sx={{ pb: 8 }}>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContainer slug={productSlug} />
      </Suspense>
    </Box>
  );
}

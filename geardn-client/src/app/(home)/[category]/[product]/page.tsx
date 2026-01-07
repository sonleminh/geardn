export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Box } from "@mui/material";
import ProductDetailContainer from "./ProductDetailContainer";
import ProductDetailSkeleton from "./ProductDetailSkeleton";

// Lưu ý: Type params trong Next 15 là Promise
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { product: productSlug } = await params;

  return (
    <Box sx={{ pb: 8 }}>
      <Suspense fallback={<ProductDetailSkeleton />} key={productSlug}>
        <ProductDetailContainer slug={productSlug} />
      </Suspense>
    </Box>
  );
}

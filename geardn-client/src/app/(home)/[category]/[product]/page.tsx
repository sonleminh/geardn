// src/app/(home)/[category]/[product]/page.tsx
import { Suspense } from "react";
import { Box } from "@mui/material";
import LayoutContainer from "@/components/layout-container";
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
    <LayoutContainer>
      <Box sx={{ pb: 8 }}>
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetailContainer slug={productSlug} />
        </Suspense>
      </Box>
    </LayoutContainer>
  );
}

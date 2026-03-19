import { notFound } from "next/navigation";
import { Suspense } from "react";

import Breadcrumbs from "@/components/common/Breadcrumbs";
import { LoadingCircle } from "@/components/common/LoadingCircle";
import LayoutContainer from "@/components/layout-container";
import { ProductSort } from "@/components/common/ProductSort";

import { parseProductListParams } from "@/lib/search/productList.params";
import { getProductsByCategory } from "@/services/products";
import { Box } from "@mui/material";

import ProductCount from "./ProductCount";
import ProductListClient from "./ProductListClient";

export default async function ProductByCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const resolvedParams = await searchParams;
  const query = parseProductListParams(resolvedParams);
  const res = await getProductsByCategory(category, query);
  if (!res) notFound();

  const categoryName = res?.category?.name || "Sản phẩm";

  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    { href: "", label: categoryName },
  ];
  return (
    <Box sx={{ pt: 2, pb: { xs: 4, md: 4 }, bgcolor: "#F3F4F6" }}>
      <LayoutContainer>
        <Box sx={{ mb: 2 }}>
          <Breadcrumbs options={breadcrumbsOptions} />
        </Box>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ProductCount total={res?.meta?.total ?? 0} />
          <ProductSort />
        </Box>
        <Suspense fallback={<LoadingCircle />}>
          <ProductListClient data={res} slug={category} query={query} />
        </Suspense>
      </LayoutContainer>
    </Box>
  );
}

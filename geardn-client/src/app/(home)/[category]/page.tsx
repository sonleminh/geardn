import Breadcrumbs from "@/components/common/Breadcrumbs";
import { LoadingCircle } from "@/components/common/LoadingCircle";
import { ProductFilters } from "@/components/common/ProductFilters";
import LayoutContainer from "@/components/layout-container";
import { getCategoryBySlug } from "@/data/category.server";
import {
  parseProductListParams,
  toURLSearchParams,
} from "@/lib/search/productList.params";
import { Box } from "@mui/material";
import { Suspense } from "react";
import ProductCount from "./ProductCount";
import ProductListContainer from "./ProductListContainer";

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
  const categoryRes = await getCategoryBySlug(category).catch(() => null);
  const categoryName = categoryRes?.data?.name || "Sản phẩm";

  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    { href: "", label: categoryName },
  ];
  return (
    <Box
      sx={{ pt: { xs: 0, md: 2 }, pb: { xs: 4, md: 4 }, bgcolor: "#F3F4F6" }}
    >
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
          <ProductCount category={category} qs={qs} />
          <ProductFilters initial={parsed} />
        </Box>
        <Suspense fallback={<LoadingCircle />}>
          <ProductListContainer category={category} qs={qs} />
        </Suspense>
      </LayoutContainer>
    </Box>
  );
}

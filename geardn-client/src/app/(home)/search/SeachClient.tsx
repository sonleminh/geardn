"use client";

import Breadcrumbs from "@/components/common/Breadcrumbs";
import ProductCard from "@/components/common/ProductCard";
import { ProductSort } from "@/components/common/ProductSort";
import LayoutContainer from "@/components/layout-container";
import { IProduct } from "@/interfaces/IProduct";
import { ProductListParams } from "@/lib/search/productList.params";
import { useSearchProductsInfinite } from "@/queries/product";
import { SearchProductsResponse } from "@/types/response.type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useMemo } from "react";

type Props = {
  data: SearchProductsResponse<IProduct> | null;
  query: ProductListParams;
};

export default function SearchClient({ data, query }: Props) {
  const q = useSearchProductsInfinite(data, query);
  const total = q?.data?.meta?.total ?? 0;
  const products = useMemo(() => {
    const seen = new Set<number>();
    const out = [];
    for (const it of q.data?.items || [])
      if (!seen.has(it.id)) {
        seen.add(it.id);
        out.push(it);
      }
    return out;
  }, [q.data]);

  const breadcrumbsOptions = [
    { href: "/", label: "Trang chủ" },
    { href: "", label: "Tìm kiếm" },
  ];

  return (
    <LayoutContainer>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs options={breadcrumbsOptions} />
      </Box>
      <Box
        sx={{
          display: " flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontSize: { xs: 13, md: 15 } }}>
          Tìm thấy {total} sản phẩm
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ProductSort />
        </Box>
      </Box>
      <Grid2 container spacing={2}>
        {products?.map((item) => (
          <Grid2 size={{ xs: 6, md: 3 }} key={item.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2>
      {q.hasNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            aria-label="Tải thêm sản phẩm"
            onClick={() => q.fetchNextPage()}
            disabled={!q.hasNextPage || q.isFetchingNextPage}
            variant="outlined"
            sx={{
              borderRadius: 100,
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {q.isFetchingNextPage
              ? "Đang tải..."
              : `Xem thêm ${total - products?.length} kết quả`}{" "}
            {!q.isFetchingNextPage && <ExpandMoreIcon sx={{ ml: 0.5 }} />}
          </Button>
        </Box>
      )}
    </LayoutContainer>
  );
}

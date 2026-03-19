"use client";

import ProductCard from "@/components/common/ProductCard";
import { IProduct } from "@/interfaces/IProduct";
import { ProductListParams } from "@/lib/search/productList.params";
import { useProductsByCategoryInfinite } from "@/queries/product";
import { ProductsByCategoryResponse } from "@/types/response.type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Grid2 } from "@mui/material";

type Props = {
  data: ProductsByCategoryResponse<IProduct>;
  slug: string;
  query: ProductListParams;
};

export default function ProductListClient({ data, slug, query }: Props) {
  const q = useProductsByCategoryInfinite(slug, data, query);
  const products = q?.data?.items;
  const total = q?.data?.meta?.total ?? 0;

  return (
    <>
      <Grid2 container spacing={2}>
        {products?.map((item) => (
          <Grid2 size={{ xs: 6, md: 3 }} key={item?.id}>
            <ProductCard data={item} />
          </Grid2>
        ))}
      </Grid2>

      {q.hasNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
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
    </>
  );
}

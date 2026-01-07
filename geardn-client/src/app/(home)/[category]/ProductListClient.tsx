"use client";

import { useProductsByCategoryInfinite } from "@/queries/product";
import ProductCard from "@/components/common/ProductCard";
import { Grid2, Box, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo } from "react";
import { ProductsByCategoryResponse } from "@/types/response.type";
import { IProduct } from "@/interfaces/IProduct";
import { useSearchParams } from "next/navigation";

type Props = {
  slug: string;
  initial: ProductsByCategoryResponse<IProduct> | null;
};

export default function ProductListClient({ slug, initial }: Props) {
  const sp = useSearchParams();
  const q = useProductsByCategoryInfinite(slug, initial, sp);
  const total = q?.data?.meta?.total ?? 0;

  const products = useMemo(() => {
    const seen = new Set<number>();
    const out = [];
    for (const it of q.data.items)
      if (!seen.has(it.id)) {
        seen.add(it.id);
        out.push(it);
      }
    return out;
  }, [q.data]);

  return (
    <>
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

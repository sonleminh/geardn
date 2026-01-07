// src/app/(home)/[category]/ProductCount.tsx
import { getProductsByCategory } from "@/data/product.server";
import { Typography } from "@mui/material";

export default async function ProductCount({
  category,
  qs,
}: {
  category: string;
  qs: URLSearchParams;
}) {
  const data = await getProductsByCategory(category, qs);
  const total = data?.meta?.total ?? 0;

  return (
    <Typography sx={{ fontSize: { xs: 13, md: 15 } }}>
      Tìm thấy <b>{total}</b> sản phẩm
    </Typography>
  );
}

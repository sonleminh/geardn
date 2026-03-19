// src/app/(home)/[category]/ProductCount.tsx
import { Typography } from "@mui/material";

export default async function ProductCount({ total }: { total: number }) {
  return (
    <Typography sx={{ fontSize: { xs: 13, md: 15 } }}>
      Tìm thấy <b>{total}</b> sản phẩm
    </Typography>
  );
}

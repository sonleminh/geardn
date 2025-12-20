// import { fetchProductsByCategory } from '@/data/product.server';
import { Box } from "@mui/material";
import { searchProducts } from "@/data/product.server";
import {
  parseProductListParams,
  toURLSearchParams,
} from "@/lib/search/productList.params";
import SearchClient from "./SeachClient";

export default async function ProductByCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const parsed = parseProductListParams(resolvedParams);
  const qs = toURLSearchParams(parsed);
  const initial = await searchProducts(qs);
  return (
    <Box
      sx={{ pt: { xs: 0, md: 2 }, pb: { xs: 4, md: 4 }, bgcolor: "#F3F4F6" }}
    >
      <SearchClient initial={initial} params={parsed} />
    </Box>
  );
}

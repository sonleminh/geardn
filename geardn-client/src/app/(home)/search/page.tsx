// import { fetchProductsByCategory } from '@/data/product.server';
import { Box } from "@mui/material";
import { parseProductListParams } from "@/lib/search/productList.params";
import SearchClient from "./SeachClient";
import { searchProducts } from "@/services/products";
import { notFound } from "next/navigation";

export default async function ProductByCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = parseProductListParams(resolvedParams);
  const res = await searchProducts(query);
  if (!res) notFound();
  return (
    <Box
      sx={{ pt: { xs: 0, md: 2 }, pb: { xs: 4, md: 4 }, bgcolor: "#F3F4F6" }}
    >
      <SearchClient data={res} query={query} />
    </Box>
  );
}

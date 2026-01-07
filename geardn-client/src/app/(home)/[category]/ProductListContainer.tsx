import { getProductsByCategory } from "@/data/product.server";
import ProductListClient from "./ProductListClient";

type Props = {
  category: string;
  qs: URLSearchParams;
};

export default async function ProductListContainer({ category, qs }: Props) {
  const initial = await getProductsByCategory(category, qs);

  return <ProductListClient slug={category} initial={initial} />;
}

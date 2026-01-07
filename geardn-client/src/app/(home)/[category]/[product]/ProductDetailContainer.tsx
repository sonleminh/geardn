import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/product.server";
import ProductDetailClient from "./ProductDetailClient";
export default async function ProductDetailContainer({
  slug,
}: {
  slug: string;
}) {
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetailClient initialProduct={product} />;
}

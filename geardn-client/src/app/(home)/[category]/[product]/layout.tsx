import React from "react";
import { Metadata } from "next";
import LayoutContainer from "@/components/layout-container";
import { getProductBySlug } from "@/data/product.server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}): Promise<Metadata> {
  const { product } = await params;

  // try {
  //   const res = await getProductBySlug(product);
  //   const productData = res?.data;

  //   const fallbackTitle = "Sản phẩm";
  //   const title = productData?.name
  //     ? `${productData.name} | GearDN`
  //     : `${fallbackTitle} | GearDN`;
  //   const description = `${productData?.name} | GearDN`;

  //   const path = `/c/${encodeURIComponent(product)}`;
  //   const images = productData?.images[0]
  //     ? [productData.images[0]]
  //     : [
  //         `/api/og?title=${encodeURIComponent(
  //           productData?.name ?? fallbackTitle
  //         )}`,
  //       ];

  //   const robots = productData
  //     ? { index: true, follow: true }
  //     : { index: false, follow: false };

  //   return {
  //     title,
  //     description,
  //     alternates: { canonical: path },
  //     openGraph: {
  //       type: "website",
  //       url: path,
  //       title,
  //       description,
  //       images,
  //     },
  //     robots,
  //   };
  // } catch (error) {
  //   console.error("Metadata Error:", error);
  return {
    title: "Sản phẩm | GearDN",
    description: "Chi tiết sản phẩm GearDN",
  };
  // }
}

export default async function ProductDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutContainer>{children}</LayoutContainer>;
}

import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { LoadingCircle } from '@/components/common/LoadingCircle';
import LayoutContainer from '@/components/layout-container';
import { getCategoryBySlug } from '@/data/category.server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const res = await getCategoryBySlug(category).catch(() => null);
  const categoryData = res?.data;

  const fallbackTitle = 'Sản phẩm';
  const title = categoryData?.name
    ? `${categoryData.name} | GearDN`
    : `${fallbackTitle} | GearDN`;
  const description = 'Danh mục sản phẩm trên GearDN';

  const path = `/c/${encodeURIComponent(category)}`;
  const images = categoryData?.icon
    ? [categoryData.icon]
    : [
        `/api/og?title=${encodeURIComponent(
          categoryData?.name ?? fallbackTitle
        )}`,
      ];

  const robots = categoryData
    ? { index: true, follow: true }
    : { index: false, follow: false };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      title,
      description,
      images,
    },
    robots,
  };
}

export default async function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingCircle />}>
      <LayoutContainer>{children}</LayoutContainer>
    </Suspense>
  );
}

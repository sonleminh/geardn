import { IProduct } from "@/interfaces/IProduct";
import { ProductListParams } from "@/lib/search/productList.params";
import { getProductsByCategory, searchProducts } from "@/services/products";
import {
  ProductsByCategoryResponse,
  SearchProductsResponse,
} from "@/types/response.type";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface IGetProductByCateParams {
  limit?: number;
  sort?: "asc" | "desc" | "";
}

export function useSearchProductsInfinite(
  initial: SearchProductsResponse<IProduct> | null,
  query: ProductListParams
) {
  return useInfiniteQuery({
    queryKey: ["products", query] as const,
    queryFn: ({ pageParam }) => searchProducts({ ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last?.meta?.nextCursor ?? undefined,
    initialData: initial
      ? { pages: [initial], pageParams: [undefined] }
      : undefined,
    staleTime: 10 * 1000,
    select: (d) => {
      const pages = d.pages;

      // 1. Flatten and filter out undefined
      const rawItems = pages
        .flatMap((p) => p?.data ?? [])
        .filter((item): item is IProduct => Boolean(item));

      // 2. Deduplicate! (The logic you had commented out, but cleaner using a Map)
      const uniqueItemsMap = new Map<number | string, IProduct>();
      rawItems.forEach((item) => {
        // Only add it if we haven't seen this ID before
        if (!uniqueItemsMap.has(item.id)) {
          uniqueItemsMap.set(item.id, item);
        }
      });

      // Convert the Map back to an array
      const items = Array.from(uniqueItemsMap.values());

      const last = pages.at(-1);
      return {
        items,
        meta: last?.meta ?? {},
      };
    },
  });
}

export function useProductsByCategoryInfinite(
  slug: string,
  initial: ProductsByCategoryResponse<IProduct> | null,
  query: ProductListParams
) {
  return useInfiniteQuery({
    queryKey: ["cate-products", slug, query] as const,
    queryFn: ({ pageParam }) =>
      getProductsByCategory(slug, { ...query, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last?.meta.nextCursor ?? undefined,
    initialData: initial
      ? { pages: [initial], pageParams: [undefined] }
      : undefined,
    staleTime: 10 * 1000,
    select: (d) => {
      const pages = d.pages;

      // 1. Flatten and filter out undefined
      const rawItems = pages
        .flatMap((p) => p?.data ?? [])
        .filter((item): item is IProduct => Boolean(item));

      // 2. Deduplicate! (The logic you had commented out, but cleaner using a Map)
      const uniqueItemsMap = new Map<number | string, IProduct>();
      rawItems.forEach((item) => {
        // Only add it if we haven't seen this ID before
        if (!uniqueItemsMap.has(item.id)) {
          uniqueItemsMap.set(item.id, item);
        }
      });

      // Convert the Map back to an array
      const items = Array.from(uniqueItemsMap.values());

      const last = pages.at(-1);
      const first = pages[0];

      return {
        items,
        meta: last?.meta ?? {},
        category: last?.category ?? first?.category ?? null,
      };
    },
  });
}

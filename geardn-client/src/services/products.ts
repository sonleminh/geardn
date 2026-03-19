import { cache } from "react";
import { IProduct } from "@/interfaces/IProduct";
import { getBackendBaseUrl } from "@/lib/backend-config";
import {
  BaseResponse,
  ProductsByCategoryResponse,
  SearchProductsResponse,
} from "@/types/response.type";
import {
  ProductListParams,
  toURLSearchParams,
} from "@/lib/search/productList.params";
export type PageMeta = { total: number; page: number; pageSize: number };

const BE = getBackendBaseUrl();

export async function getProducts(query: ProductListParams) {
  const queryString = toURLSearchParams(query);

  const res = await fetch(`${BE}/products/homepage?${queryString}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(`Error fetching product list`, res.status, await res.text());
    throw new Error(`Failed to fetch search product list: ${res.status}`);
  }
  return res.json() as Promise<SearchProductsResponse<IProduct>>;
}

export async function searchProducts(query: ProductListParams) {
  const queryString = toURLSearchParams(query);
  const res = await fetch(`${BE}/products/search?${queryString}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(
      `Error fetching search product`,
      res.status,
      await res.text()
    );
    throw new Error(`Failed to fetch search product list: ${res.status}`);
  }
  return res.json() as Promise<SearchProductsResponse<IProduct>>;
}

export const getProductsByCategory = cache(
  async (slug: string, query: ProductListParams) => {
    const queryString = toURLSearchParams(query);

    const res = await fetch(
      `${BE}/products/category/slug/${encodeURIComponent(slug)}?${queryString}`,
      {
        next: { revalidate: 1800 },
      }
    );

    if (res.status === 404) return null;

    if (!res.ok) {
      console.error(
        `Error fetching product ${slug}:`,
        res.status,
        await res.text()
      );
      throw new Error(`Failed to fetch product list: ${res.status}`);
    }
    return res.json() as Promise<ProductsByCategoryResponse<IProduct>>;
  }
);

export const getProductBySlug = cache(async (slug: string) => {
  const res = await fetch(`${BE}/products/slug/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(
      `Error fetching product ${slug}:`,
      res.status,
      await res.text()
    );
    throw new Error(`Failed to fetch product: ${res.status}`);
  }

  return res.json() as Promise<BaseResponse<IProduct>>;
});

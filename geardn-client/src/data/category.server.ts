import { headers } from "next/headers";
import { ICategory } from "@/interfaces/ICategory";
import { BaseResponse, PageListResponse } from "@/types/response.type";
import { getBackendBaseUrl } from "@/lib/backend-config";

const BE = getBackendBaseUrl();

export async function getCategoryBySlug(slug: string) {
  const res = await fetch(`${BE}/categories/slug/${encodeURIComponent(slug)}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(`Error fetching category`, res.status, await res.text());
    throw new Error(`Failed to fetch category: ${res.status}`);
  }
  return res.json() as Promise<BaseResponse<ICategory>>;
}

export async function getCategories() {
  const res = await fetch(`${BE}/categories`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(`Error fetching category list`, res.status, await res.text());
    throw new Error(`Failed to fetch category list: ${res.status}`);
  }
  return res.json() as Promise<PageListResponse<ICategory>>;
}

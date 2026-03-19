import { z } from "zod";
export type SortByKey = "createdAt" | "price";
export type OrderKey = "asc" | "desc";

type ResolvedSearchParams = { [key: string]: string | string[] | undefined };

const productParamsSchema = z.object({
  keyword: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
  sortBy: z.enum(["price", "createdAt", "name"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  category: z.string().trim().optional(),
  cursor: z.string().trim().optional(),
});

export type ProductListParams = z.infer<typeof productParamsSchema>;

export function parseProductListParams(searchParams: ResolvedSearchParams) {
  return productParamsSchema.parse(searchParams);
}

export function toURLSearchParams(p: ProductListParams) {
  const qs = new URLSearchParams();
  if (p.keyword) qs.set("keyword", p.keyword);
  if (p.category) qs.set("category", p.category);
  if (p.sortBy) qs.set("sortBy", p.sortBy);
  if (p.order) qs.set("order", p.order);
  if (p.page && p.page > 1) qs.set("page", String(p.page));
  if (p.limit) qs.set("limit", String(p.limit));
  if (p.cursor) qs.set("cursor", p.cursor);

  return qs;
}

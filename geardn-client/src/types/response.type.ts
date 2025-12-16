import { ICategory } from "@/interfaces/ICategory";

export type Pagination = {
  total: number;
  page: number;
  pageSize: number;
}

export type CursorMeta = {
  nextCursor?: string | null;
  hasMore?: boolean;
  total?: number;
};

export type BaseResponse<T, M = unknown> = {
  success: boolean;
  message: string;
  data: T;
  meta?: M;
};

export type PageListResponse<T> = {
  data: T[];
  meta: Pagination;
  success: boolean;
  message: string;
};

export type ProductsByCategoryResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: CursorMeta;
  category: ICategory;
};

export type SearchProductsResponse<T> = {
  success: boolean;
  message: string;
  data: T[];
  meta: CursorMeta;
};

export type Ok<T> = { ok: true; data: T; status: number; meta?: unknown };
export type NotFound = { ok: false; notFound: true; status: 404; message?: string };
export type Err = { ok: false; status: number; message: string };
export type Result<T> = Ok<T> | Err | NotFound;
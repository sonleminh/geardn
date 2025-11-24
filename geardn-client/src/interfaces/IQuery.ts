export interface IQueryParams {
  q?: string;
  page?: number | undefined;
  limit?: number;
  sortBy?: 'createdAt' | 'price';
  order?: 'desc' | 'asc';
  category?: string;
}

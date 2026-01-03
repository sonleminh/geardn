export interface ICategory {
  id: number;
  name: string;
  icon: string;
  slug?: string;
  priority: number;
  isDeleted?: boolean;
  createdAt?: Date;
}

export interface ICreateCategory extends Record<string, unknown> {
  name: string;
  icon: string;
  slug?: string;
}

export interface IUpdateCategoryPayload {
  id: number;
  name: string;
  icon: string;
  slug?: string;
}

export interface IUpdateCategoryPriorityPayload {
  id: number;
  priority: number;
}

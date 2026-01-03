import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axiosInstance";
import { QueryKeys } from "@/constants/query-key";
import {
  ICategory,
  ICreateCategory,
  IUpdateCategoryPayload,
  IUpdateCategoryPriorityPayload,
} from "@/interfaces/ICategory";
import { TBaseResponse, TPaginatedResponse } from "@/types/response.type";

const categoryUrl = "/categories";

const getCategoryList = async () => {
  const result = await axiosInstance.get(`${categoryUrl}`);
  return result.data as TPaginatedResponse<ICategory>;
};

export const useGetCategoryList = () => {
  return useQuery({
    queryKey: [QueryKeys.Category],
    queryFn: () => getCategoryList(),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
};

const getCategoryById = async (id: number) => {
  const result = await axiosInstance.get(`${categoryUrl}/${id}`);
  return result.data as TBaseResponse<ICategory>;
};

export const useGetCategoryById = (id: number) => {
  return useQuery({
    queryKey: [QueryKeys.Category, id],
    queryFn: () => getCategoryById(id),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    enabled: !!id,
  });
};

const createCategory = async (payload: ICreateCategory) => {
  const result = await axiosInstance.post(`${categoryUrl}`, payload);
  return result.data as ICategory;
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: createCategory,
  });
};

const updateCategory = async (payload: IUpdateCategoryPayload) => {
  const { id, ...rest } = payload;
  const result = await axiosInstance.patch(`${categoryUrl}/${id}`, rest);
  return result.data as ICategory;
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: updateCategory,
  });
};

const updateCategoryPriority = async (
  payload: IUpdateCategoryPriorityPayload
) => {
  const { id, ...rest } = payload;
  const result = await axiosInstance.patch(`${categoryUrl}/${id}`, rest);
  return result.data as ICategory;
};

export const useUpdateCategoryPriority = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategoryPriority,
    onMutate: async (payload: IUpdateCategoryPriorityPayload) => {
      queryClient.cancelQueries({ queryKey: [QueryKeys.Category] });

      const allProductQueries = queryClient.getQueriesData({
        queryKey: [QueryKeys.Category],
      });

      const prevData = allProductQueries.map(([queryKey, data]) => [
        queryKey,
        data ? JSON.parse(JSON.stringify(data)) : data,
      ]);

      allProductQueries.forEach(([queryKey, data]) => {
        if (data) {
          queryClient.setQueryData(
            queryKey,
            (old: TPaginatedResponse<ICategory> | undefined) => {
              if (!old) return old;
              const items = old.data.map((it: ICategory) => {
                if (it.id === payload.id) {
                  return { ...it, priority: payload.priority };
                }
                return it;
              });
              return { ...old, data: items };
            }
          );
        }
      });
      return { prevData };
    },
    onError: (_err, _payload, ctx) => {
      if (!ctx?.prevData) return;
      (ctx.prevData as Array<[unknown, unknown]>).forEach(
        ([queryKey, data]) => {
          queryClient.setQueryData(queryKey as any, data);
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Product] });
    },
  });
};

const deleteCategory = async (id: number) => {
  const result = await axiosInstance.delete(`${categoryUrl}/${id}`);
  return result.data;
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: deleteCategory,
  });
};

const restoreCategory = async (id: number) => {
  const result = await axiosInstance.patch(`${categoryUrl}/${id}/restore`);
  return result.data;
};

export const useRestoreCategory = () => {
  return useMutation({
    mutationFn: restoreCategory,
  });
};

const deleteCategoryPermanent = async (id: number) => {
  const result = await axiosInstance.delete(`${categoryUrl}/${id}/permanent`);
  return result.data;
};

export const useDeleteCategoryPermanent = () => {
  return useMutation({
    mutationFn: deleteCategoryPermanent,
  });
};

import { addCartItem, deleteCartItem, getCart, getCartStock, syncCart, updateQty } from '@/apis/cart';
import { IAddCartItemPayload, ICartResponse, ICartStockItem, ISyncCartPayload, IUpdateQuantityPayload, IUpdateQuantityResponse } from '@/interfaces/ICart';
import { BaseResponse } from '@/types/response.type';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetCart(enabled: boolean, initialData?: BaseResponse<ICartResponse> | null) {
  return useQuery<BaseResponse<ICartResponse>, Error>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled,
    initialData: initialData ?? undefined, 
    staleTime: 0,
    gcTime: 0,
  });
}

export function useGetCartStock(skuIds: number[]) {
  const key = ['cart-stock', skuIds.slice().sort((a,b)=>a-b).join(',')];
  return useQuery<BaseResponse<ICartStockItem[]>, Error>({
    queryKey: [key],
    queryFn: () => getCartStock(skuIds), 
    enabled: skuIds.length > 0,
  });
}

export function useSyncCart() {
  return useMutation<BaseResponse<ICartResponse>, Error, ISyncCartPayload>({
    mutationFn: syncCart,
  });
}

export function useAddCartItem() {
  return useMutation<BaseResponse<object>, Error, IAddCartItemPayload>({
    mutationFn: addCartItem,
  });
}

export function useUpdateQuantity() {
  return useMutation<BaseResponse<IUpdateQuantityResponse>, Error, IUpdateQuantityPayload>({
    mutationFn: updateQty,
  });
}

export function useDeleteCartItem() {
  return useMutation<BaseResponse<IUpdateQuantityResponse>, Error, number>({
    mutationFn: deleteCartItem,
  });
}
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrder, getUserPurchases } from '@/apis/order';
import { BaseResponse } from '@/types/response.type';
import { ICreateOrderPayload, IOrder } from '@/interfaces/IOrder';

export function useCreateOrder() {
  return useMutation<BaseResponse<IOrder>, Error, ICreateOrderPayload>({
    mutationFn: createOrder,
  });
}


export function useUserPurchases(p :{type: number}) {
  return useQuery({
    queryKey: ['user-purchases', p.type],
    queryFn: () => getUserPurchases(p),
  });
}
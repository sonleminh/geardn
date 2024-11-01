// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ICart, ICartPayload } from '@/interfaces/ICart';
import { deleteRequest, getRequest, patchRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { ICreateOrder, IOrder } from '@/interfaces/IOrder';

type TOrdersByUserRes = {
  orderList: IOrder[];
  total: number;
};

export const createOrder = (payload: ICreateOrder) => {
  try {
    const res = postRequest(`${BASE_API_URL}/order`, payload);
    return res;
  } catch (error) {
    throw error
  }
};

export const useGetOrdersByUser = () => {
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/order`, fetcher);
  return {
    data: data as TOrdersByUserRes,
    isLoading,
    isError: error,
  };
};
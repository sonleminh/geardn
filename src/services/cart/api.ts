// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ICart, ICartPayload } from '@/interfaces/ICart';
import { deleteRequest, patchRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { IError } from '@/interfaces/IError';

export const addCartAPI = (payload: ICartPayload) => {
  try {
    const res = postRequest(`${BASE_API_URL}/cart/add`, payload);
    return res as ICart;
  } catch (error) {
    throw error as IError
  }
};

export const subtractCartAPI = (payload: ICartPayload) => {
  try {
    const res = postRequest(`${BASE_API_URL}/cart/subtract`, payload);
    return res;
  } catch (error) {
    throw error
  }
};

export const updateCartQuantityAPI = (payload: ICartPayload) => {
  try {
    const res = patchRequest(`${BASE_API_URL}/cart`, payload);
    return res;
  } catch (error) {
    throw error
  }
};

export const useGetCart = () => {
  const { data, error, isLoading, mutate } = useSWR(`${BASE_API_URL}/cart`, fetcher);
  return {
   cart: data as ICart,
    isLoading,
    isError: error,
    mutate
  };
};

export const deleteCartItem = (item_id:string) => {
  try {
    const res = deleteRequest(`${BASE_API_URL}/cart/${item_id}`);
    return res;
  } catch (error) {
    throw error
  }
};
// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { IAddCartItem, ICart, ICartPayload } from '@/interfaces/ICart';
import { deleteRequest, patchRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { IError } from '@/interfaces/IError';

export const addCartItemAPI = (payload: IAddCartItem) => {
  try {
    console.log('payload', payload)
    const res = postRequest(`/carts/add`, payload);
    return res;
  } catch (error) {
    throw error as IError
  }
};

export const subtractCartAPI = (payload: ICartPayload) => {
  try {
    const res = postRequest(`/cart/subtract`, payload);
    return res;
  } catch (error) {
    throw error
  }
};

export const updateCartQuantityAPI = (payload: ICartPayload) => {
  try {
    const res = patchRequest(`/cart`, payload);
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

export const deleteCartItem = (itemid:string) => {
  try {
    const res = deleteRequest(`/cart/${itemid}`);
    return res;
  } catch (error) {
    throw error
  }
};
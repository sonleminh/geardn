// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ILogInResponse, ILogoutResponse, ISignUpPayload, ISignUpResponse } from '@/interfaces/IAuth';
import { getRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { IProduct } from '@/interfaces/IProduct';

type TProductsRes = {
  productList: IProduct[];
  categories: {
    _id: string;
    label: string;
  }[];
  total: number;
};

export const useGetProducts = () => {
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/product`, fetcher);
  return {
    products: data as TProductsRes,
    isLoading,
    isError: error,
  };
};
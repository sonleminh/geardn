// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL, SERVER_API_URL } from '@/constants/env';
import { ILogInResponse, ILogoutResponse, ISignUpPayload, ISignUpResponse } from '@/interfaces/IAuth';
import { getRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { IProduct } from '@/interfaces/IProduct';
import { ISku } from '@/interfaces/ISku';

type TProductsRes = {
  products: IProduct[];
  categories: {
    _id: string;
    label: string;
  }[];
  total: number;
};

type TCategoriesRes = {
  categories: {
    _id: string;
    name: string;
    icon: string;
    slug: string;
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

export const useGetProductById = (id: string) => {
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/product/${id}`, fetcher);
  return {
    product: data as IProduct,
    isLoading,
    isError: error,
  };
};

export const useGetSKUByPrdId = (id: string) => {
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/product-sku/product/${id}`, fetcher);
  return {
    skuList: data as ISku[],
    isLoading,
    isError: error,
  };
};

export const useGetCategories = () => {
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/category`, fetcher);
  return {
    categories: data as TCategoriesRes,
    isLoading,
    isError: error,
  };
};

export const getPrdByCateSlug = async (id:string) => {
  try {
    const result = await fetch(
      `${SERVER_API_URL}/${id}/api`
    ).then((res) => res.json());
  // return result as IArticleByIdResponse;
  return result as any;
} catch (error) {
   throw new Error('Failed to fetch article list by ID API') 
  }
};
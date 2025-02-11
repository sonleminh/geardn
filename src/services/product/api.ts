// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL, SERVER_API_URL } from '@/constants/env';
import { ILogInResponse, ILogoutResponse, ISignUpPayload, ISignUpResponse } from '@/interfaces/IAuth';
import { getRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { IProduct } from '@/interfaces/IProduct';
import { ISku } from '@/interfaces/ISku';
import { IQuery } from '@/interfaces/IQuery';
import queryString from 'query-string';

type TProductsRes = {
  products: IProduct[];
  categories: {
    id: string;
    label: string;
  }[];
  total: number;
};

type TCategoriesRes = {
  categories: {
    id: string;
    name: string;
    icon: string;
    slug: string;
  }[];
  total: number;
};


export const useGetProducts = (query?: IQuery) => {
  const newParams = { ...query };
  const queryParams = queryString.stringify(newParams ?? {});
  console.log('qr:', queryParams)
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/products?${queryParams}`, fetcher);
  return {
    products: data as TProductsRes,
    isLoading,
    isError: error,
  };
};

export const useGetProductById = (id: number) => {
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/products/${id}`, fetcher);
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
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/categories`, fetcher);
  return {
    categories: data as TCategoriesRes,
    isLoading,
    isError: error,
  };
};

export const getPrdByCateSlug = async (slug:string) => {
  try {
    // console.log(slug)
    // const result = await fetch(
    //   `http://localhost:3000/gia-treo-man-hinh/api`
    //   // `${SERVER_API_URL}/${slug}/api`
    // ).then((res) => res.json());
    const result = await getRequest(
      `${SERVER_API_URL}/${slug}/api`
    )
  return result as IProduct[];
} catch (error) {
   throw new Error('Failed to fetch article list by ID API') 
  }
};
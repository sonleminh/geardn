// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ICart, ICartPayload } from '@/interfaces/ICart';
import { deleteRequest, getRequest, patchRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';
import { ICreateOrder, IOrder } from '@/interfaces/IOrder';

type TOrdersByUserRes = {
  order_list: IOrder[];
  total: number;
};

export interface IProvince {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: IDistrict[];
}

interface IDistrict {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: IWards[];
}

interface IWards {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  short_codename: string;
}

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

export const useGetOrderById = (id: string) => {
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/order/${id}`, fetcher);
  return {
    order: data as IOrder,
    isLoading,
    isError: error,
  };
};

export const useGetProvinces = () => {
  const { data, error, isLoading, mutate } = useSWR('https://provinces.open-api.vn/api/?depth=2',  (url) => fetcher(url, false));
  return {
   provinces: data as IProvince[],
    isLoading,
    isError: error,
    mutate
  };
};

export const useGetDistrict = (code: string) => {
  const { data, error, isLoading, mutate } = useSWR(`https://provinces.open-api.vn/api/d/${code}?depth=2`,  (url) => fetcher(url, false));
  return {
    district: data as IDistrict,
    isLoading,
    isError: error,
    mutate
  };
};
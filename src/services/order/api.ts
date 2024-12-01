// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ICreateOrder, IOrder } from '@/interfaces/IOrder';
import { IPayment } from '@/interfaces/IPayment';
import { postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';

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

export interface IDistrict {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: IWard[];
}

export interface IWard {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  short_codename: string;
}

type TPaymentsRes = {
  status: number;
  message: string;
  data: IPayment[];
};

export const createOrder = async (payload: ICreateOrder) => {
  try {
    const res: IOrder = await postRequest(`/order`, payload);
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

export const useGetProvinceList = () => {
  const { data, error, isLoading, mutate } = useSWR('https://provinces.open-api.vn/api',  (url) => fetcher(url, false));
  return {
   province_list: data as IProvince[],
    isLoading,
    isError: error,
    mutate
  };
};

export const useGetProvince = (code: number | undefined) => {
  const { data, error, isLoading, mutate } = useSWR( code ? `https://provinces.open-api.vn/api/p/${code}?depth=2` : null,  (url) => fetcher(url, false));
  return {
    province: data as IProvince,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useGetDistrict = (code: number | undefined) => {
  const { data, error, isLoading, mutate } = useSWR(code ? `https://provinces.open-api.vn/api/d/${code}?depth=2` : null,  (url) => fetcher(url, false));
  return {
    districtData: data as IDistrict,
    isLoading,
    isError: error,
    mutate
  };
};

export const useGetPaymentMethods = () => {
  const { data, error, isLoading, mutate } = useSWR(`${BASE_API_URL}/payment-method`, fetcher);
  return {
    paymentMethods: data as TPaymentsRes,
    isLoading,
    isError: error,
    mutate
  };
};
// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ICart, ICartPayload } from '@/interfaces/ICart';
import { deleteRequest, patchRequest, postRequest } from '@/utils/fetch-client';
import useSWR from 'swr';
import { fetcher } from '../fetcher';

export const createOrderAPI = (payload: ICartPayload) => {
  try {
    const res = postRequest(`${BASE_API_URL}/order`, payload);
    return res;
  } catch (error) {
    throw error
  }
};
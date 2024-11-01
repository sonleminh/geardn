import { BASE_API_URL } from '@/constants/env';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher } from '../fetcher';
import { postRequest } from '@/utils/fetch-client';
import { ICartPayload } from '@/interfaces/ICart';

export function useUpsertCart() {
  const { data, error, mutate } = useSWR(null, fetcher, {
    revalidateOnFocus: false, 
    shouldRetryOnError: false,
  });
  const upsertCart = async (payload: ICartPayload) => {
    const response = await postRequest(`${BASE_API_URL}/cart/add`, payload);

    if (response) {
      mutate(response, false); // You can choose to revalidate if needed
    } else {
      throw new Error('Add item failed!');
    }
    return response;
  };
  return {
    data,
    mutate,
    upsertCart,
    isLoading: !error && !data,
    isError: error,
  };
}
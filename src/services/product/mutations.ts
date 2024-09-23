import { BASE_API_URL } from '@/constants/env';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher } from '../fetcher';
import { getRequest, postRequest } from '@/utils/fetch-client';

export function useSignUpAPI() {
  const { data, error, mutate } = useSWR(null, fetcher, {
    revalidateOnFocus: false, 
    shouldRetryOnError: false,
  });
  const signUp = async () => {
    const response = await getRequest(`${BASE_API_URL}/product`);

    if (response) {
      mutate(response, false); // You can choose to revalidate if needed
    } else {
      throw new Error('Sign up failed!');
    }
    return response;
  };
  return {
    data,
    mutate,
    signUp,
    isLoading: !error && !data,
    isError: error,
  };
}
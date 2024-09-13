import { BASE_API_URL } from '@/constants/env';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { signUpAPI } from './auth';
import { fetcher } from './fetcher';

export function useSignUpAPI() {
    // const { mutate } = useSignUp();
  return useSWRMutation(`${BASE_API_URL}/auth/signup`, signUpAPI,{
    onError(error) {
      console.log("error", error);
    },
    onSuccess: (data) => {
    //   mutate();
      console.log('data:', data)
    },
  })
}

export function useLoginAPI() {
  const { data, error, mutate } = useSWR(`${BASE_API_URL}/auth/login`, fetcher, {
      revalidateOnFocus: false, 
      shouldRetryOnError: false,
    });
  return {
    data,
    mutate,
    isLoading: !error && !data,
    isError: error,
  };
}
import { BASE_API_URL } from '@/constants/env';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { signUpAPI } from './auth';
import { fetcher } from './fetcher';
import { postRequest } from '@/utils/fetch-client';

export function useSignUpAPI() {
  const { data, error, mutate } = useSWR(null, fetcher, {
    revalidateOnFocus: false, 
    shouldRetryOnError: false,
  });
  const signUp = async (signUpData: {name: string, email: string, password: string}) => {
    const response = await postRequest(`${BASE_API_URL}/auth/signup`, signUpData);

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

export function useLoginAPI() {
  const { data, error, mutate } = useSWR(null, fetcher, {
      revalidateOnFocus: false, 
      shouldRetryOnError: false,
    });
  const login = async (loginData: {email: string, password: string}) => {
    const response = await postRequest(`${BASE_API_URL}/auth/login`, loginData);

    if (response) {
      mutate(response, false); // You can choose to revalidate if needed
    } else {
      throw new Error('Login failed!');
    }
    return response;
  };
  return {
    data,
    mutate,
    login,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useLogoutAPI() {
  const { data, error, mutate } = useSWR(null, fetcher, {
      revalidateOnFocus: false, 
      shouldRetryOnError: false,
    });
  const logout = async () => {
    const response = await postRequest(`${BASE_API_URL}/auth/logout`, {});

    if (response) {
      mutate(response, false); // You can choose to revalidate if needed
    } else {
      throw new Error('Logout failed!');
    }
    return response;
  };
  return {
    data,
    mutate,
    logout,
    isLoading: !error && !data,
    isError: error,
  };
}
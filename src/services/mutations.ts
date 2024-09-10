import useSWRMutation from 'swr/mutation'
import { cookieAPI, loginAPI, signUpAPI } from './auth'
import { useSignUp } from './queries';
import { BASE_API_URL } from '@/constants/env';

export function useSignUpAPI() {
    // const { mutate } = useSignUp();
  return useSWRMutation(`${BASE_API_URL}/auth/signup`, signUpAPI,{
    onError() {
      console.error("error");
    },
    onSuccess: () => {
    //   mutate();
      console.log(22)
    },
  })
}

export function useLoginAPI() {
  return useSWRMutation(`${BASE_API_URL}/auth/login`, loginAPI,{
    onError() {
      console.error("error");
    },
    onSuccess: () => {
    //   mutate();
      console.log(22)
    },
  })
}

export function useCookieAPI() {
    return useSWRMutation(`${BASE_API_URL}/auth/ck`, cookieAPI,{
      onError() {
        console.error("error");
      },
      onSuccess: () => {
      //   mutate();
        console.log(22)
      },
    })
  }

// export function useSignIn() {
//     return useSWRMutation('/auth/signin')
//   }
  
import useSWRMutation from 'swr/mutation'
import { signUpApi } from './auth'
import { useSignUp } from './queries';

// export function useSignUpAPI() {
//     const { mutate } = useSignUp();
//   return useSWRMutation('/auth/signup', signUpApi,{
//     onError() {
//       console.error("error");
//     },
//     onSuccess: () => {
//       mutate();
//     },
//   })
// }

// export function useSignIn() {
//     return useSWRMutation('/auth/signin')
//   }
  
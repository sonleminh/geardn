import { googleLogin, loginWithEmailPwd, logout, signup } from '@/apis/auth';
import { ILogInResponse, ILogoutResponse, ISignUpResponse } from '@/interfaces/IAuth';
import { BaseResponse } from '@/types/response.type';
import { useMutation } from '@tanstack/react-query';

export function useLoginWithEmailPwd() {
  return useMutation<BaseResponse<ILogInResponse>, Error, {email: string; password: string}>({
    mutationFn: loginWithEmailPwd,
  });
}

export function useGoogleLogin() {
  return useMutation<BaseResponse<ILogInResponse>, Error, {idToken: string}>({
    mutationFn: googleLogin,
  });
}

export function useSignup() {
  return useMutation<BaseResponse<ISignUpResponse>, Error,{ name: string; email: string; password: string }>({
    mutationFn: signup,
  });
}

export function useLogout() {
  return useMutation<BaseResponse<ILogoutResponse>, Error>({
    mutationFn: logout,
  });
}
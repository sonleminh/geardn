import { ILogInResponse, ILogoutResponse, ISignUpResponse } from "@/interfaces/IAuth";
import { bff } from "@/lib/api-fetch";
import { BaseResponse } from "@/types/response.type";

export const signup = (payload: { name: string; email: string; password: string }) => bff<BaseResponse<ISignUpResponse>>('/api/bff/auth/signup', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});

export const loginWithEmailPwd =  (payload: { email: string; password: string }) => bff<BaseResponse<ILogInResponse>>('/api/bff/auth/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});

export const googleLogin =  (payload: {idToken: string }) => bff<BaseResponse<ILogInResponse>>('/api/bff/auth/google/verify-id-token', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
});

export const logout = () => 
bff<BaseResponse<ILogoutResponse>>('/api/bff/auth/logout', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
});

export const whoami = () =>  bff('/api/bff/auth/whoami', { cache: 'no-store' });
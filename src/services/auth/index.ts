// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ILogInResponse, ISignUpPayload, ISignUpResponse } from '@/interfaces/IAuth';
import { getRequest, postRequest } from '@/utils/fetch-client';

const articleUrl = 'article';

type TInitDataRes = {
  tags?: { value: string; label: string }[];
};

const authUrl = '/auth';

export const loginAPI = async (
  url: string,
  { arg }: { arg: { email: string,  password: string  } }
) => {
  await postRequest(url, { email: arg.email, password: arg.password });
};

export const signUpAPI = async (
  url: string,
  { arg }: { arg: { fullName: string,email: string,  password: string  } }
) => {
  await postRequest(url, { fullName: arg.fullName, email: arg.email, password: arg.password });
};

export async function login(payload: {email: string, password: string}) {
  try {
    const res: ILogInResponse = await postRequest(`${BASE_API_URL}/auth/login`, payload);
    return res;
  } catch (error) {
    throw error
  }
}

export async function signUp(payload: {fullName: string ,email: string, password: string}) {
  try {
    const res: ISignUpResponse = await postRequest(`${BASE_API_URL}/auth/signup`, payload);
    return res;
  } catch (error) {
    throw error
  }
}
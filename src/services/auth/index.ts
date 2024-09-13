// import { QueryKeys } from '@/components/constants/query-key';
// import { useQuery } from '@tanstack/react-query';

import { BASE_API_URL } from '@/constants/env';
import { ISignUpPayload } from '@/interfaces/IAuth';
import { ISignInResponse } from '@/interfaces/IUser';
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

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error: any = new Error('Failed to login');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}
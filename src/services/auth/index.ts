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


// export const signUpApi = async (payload: ISignInPayload) => {
//   const result = await postRequest(`${authUrl}/signin`, payload);
//   return result;
// };

// export function useLogin () {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
  
//   const { mutate, isValidating } = useSWR(
//     null,
//     login,
//     {
//       onError: (err) => setError(err),
//       onSuccess: (data) => setData(data),
//     }
//   );

//   const login = async (username, password) => {
//     await mutate({ username, password });
//   };

//   return {
//     login,
//     data,
//     error,
//     isLoading: isValidating,
//   };
// };
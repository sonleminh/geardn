import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
// import { ACCESS_TOKEN_KEY } from 'src/constants/const';

export const privateInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  withCredentials: true
});

privateInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('rt');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  async (error) => Promise.reject(error)
);

privateInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.data.statusCode === 403) {
      window.location.href = `/admin/not-found`;
    }

    return Promise.reject(error);
  }
);

export async function getRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
  errCallback?: () => void
): Promise<AxiosResponse<T>> {
  try {
    const response: AxiosResponse<T> = await privateInstance.get(url, config);
    return response;
  } catch (error) {
    errCallback?.();
    await logger(error as AxiosError);
    throw error;
  }
}

export async function postRequest<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
  errCallback?: () => void
): Promise<AxiosResponse<T>> {
  try {
    const response: AxiosResponse<T> = await privateInstance.post(
      url,
      data,
      config
    );
    return response;
  } catch (error) {
    errCallback?.();
    await logger(error as AxiosError);
    throw error;
  }
}

export async function putRequest<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
  errCallback?: () => void
): Promise<AxiosResponse<T>> {
  try {
    const response: AxiosResponse<T> = await privateInstance.put(
      url,
      data,
      config
    );

    return response;
  } catch (error) {
    errCallback?.();
    await logger(error as AxiosError);
    throw error;
  }
}

export async function deleteRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
  errCallback?: () => void
): Promise<AxiosResponse<T>> {
  try {
    const response: AxiosResponse<T> = await privateInstance.delete(
      url,
      config
    );
    return response;
  } catch (error) {
    errCallback?.();
    await logger(error as AxiosError);
    throw error;
  }
}

export async function patchRequest(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
  errCallback?: () => void
) {
  try {
    const response = await privateInstance.patch(url, data, config);
    return response;
  } catch (error) {
    errCallback?.();
    await logger(error);
    throw error;
  }
}

async function logger(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('Response Error', error.response.status, error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request Error', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message);
  }
}

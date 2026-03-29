import { getSession, removeSession } from "@/authentication/cookie-session";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = import.meta.env.VITE_APP_HOST;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: AxiosError) => void;
}> = [];

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true,
});

const axiosExtend: AxiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true,
});

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

export const redirectToLogin = () => {
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
};

axiosExtend.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      removeSession();
      redirectToLogin();
    }
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getSession();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);
    if (error?.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosInstance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // No getRefreshToken() guard — withCredentials sends the
      // HttpOnly refresh_token cookie from api.geardn.id automatically.
      // If it's expired, the backend 401s and we catch below.
      await axiosExtend.get("/admin/auth/refresh-token");

      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      removeSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { axiosExtend, axiosInstance };

import {
  getRefreshToken,
  getSession,
  removeSession,
} from "@/authentication/cookie-session";
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
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
}> = [];

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true, // sends refresh token cookie
});

// axiosExtend: no auth header, used for refresh calls
const axiosExtend: AxiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true, // still needs cookies for refresh token
});

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  // Centralized navigation — use your router's navigate if available
  // This avoids the auth guard racing with the interceptor
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// ─── axiosExtend: no-auth instance (for refresh + public endpoints) ──────────

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

// ─── axiosInstance: authenticated instance ───────────────────────────────────

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

    const is401 = error?.response?.status === 401;
    const alreadyRetried = originalRequest._retry;

    if (!is401 || alreadyRetried) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosInstance(originalRequest)) // retry with new token (picked up via getSession in request interceptor)
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      removeSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    try {
      // KEY FIX: use axiosExtend here — no expired Authorization header
      await axiosExtend.get(`/admin/auth/refresh-token`);

      // New token is now set in cookie by the server
      // getSession() in the request interceptor will pick it up on retry
      processQueue(null, null);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      removeSession();
      redirectToLogin(); // Only navigate here — after refresh definitively fails
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { axiosExtend, axiosInstance };

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { StorageService } from '@/services/storage.service';
import { Endpoints } from '@/constants/api';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

export function applyAuthInterceptors(client: AxiosInstance): void {
  // Request: attach access token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await StorageService.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  // Response: handle 401, refresh token, retry
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await StorageService.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${client.defaults.baseURL}${Endpoints.auth.refresh}`,
          { refreshToken },
        );

        // New API returns tokens flat inside data.data: { accessToken, refreshToken }
        const tokenPayload = data.data ?? data;
        const { accessToken, refreshToken: newRefreshToken } =
          tokenPayload.tokens ?? tokenPayload;
        await StorageService.setTokens(accessToken, newRefreshToken);
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await StorageService.clearTokens();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    },
  );
}

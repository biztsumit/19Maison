import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '@/types';

export function applyErrorInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    response => response,
    (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ??
        error.message ??
        'An unexpected error occurred';

      // Normalize error shape
      return Promise.reject({
        message,
        statusCode: error.response?.status ?? 0,
        errors: error.response?.data?.errors,
      } satisfies Partial<ApiError>);
    },
  );
}

/* eslint-disable no-console -- this module exists to print request logs */
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Anything matching these keys is masked before printing. Tokens and passwords
// end up in device logs and crash reports otherwise.
const SENSITIVE = [
  'password',
  'newpassword',
  'confirmpassword',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'token',
  'otp',
  'razorpaysignature',
  'key',
  'keyid',
];

function redact(value: unknown, depth = 0): unknown {
  if (depth > 4 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(entry => redact(entry, depth + 1));

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      if (SENSITIVE.includes(key.toLowerCase())) {
        return [key, typeof entry === 'string' && entry.length > 0 ? '[redacted]' : entry];
      }
      return [key, redact(entry, depth + 1)];
    }),
  );
}

function pretty(value: unknown): string {
  if (value === undefined) return '';
  try {
    return JSON.stringify(redact(value), null, 2);
  } catch {
    return String(value);
  }
}

type TimedConfig = InternalAxiosRequestConfig & { metadata?: { start: number } };

function fullUrl(config: InternalAxiosRequestConfig): string {
  const base = (config.baseURL ?? '').replace(/\/$/, '');
  const path = config.url ?? '';
  return path.startsWith('http') ? path : `${base}${path}`;
}

function elapsed(config?: TimedConfig): string {
  const start = config?.metadata?.start;
  return start ? ` (${Date.now() - start}ms)` : '';
}

export function applyLoggingInterceptor(client: AxiosInstance): void {
  // __DEV__ is false in release bundles. These lines carry customer PII and auth
  // material, so they must never ship.
  if (!__DEV__) return;

  client.interceptors.request.use(
    (config: TimedConfig) => {
      config.metadata = { start: Date.now() };

      const method = (config.method ?? 'get').toUpperCase();
      console.log(`\n──▶ ${method} ${fullUrl(config)}`);
      if (config.params) console.log('   params:', pretty(config.params));
      if (config.data) console.log('   body:', pretty(config.data));
      // config.headers is an AxiosHeaders instance, not a plain object.
      const headers =
        typeof config.headers?.toJSON === 'function' ? config.headers.toJSON() : config.headers;
      console.log('   headers:', pretty(headers));

      return config;
    },
    (error: unknown) => {
      console.log('──▶ request failed before sending:', error);
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const method = (response.config.method ?? 'get').toUpperCase();
      console.log(
        `◀── ${response.status} ${method} ${fullUrl(response.config)}${elapsed(response.config)}`,
      );
      console.log('   data:', pretty(response.data));
      return response;
    },
    (error: AxiosError) => {
      const config = error.config as TimedConfig | undefined;
      const method = (config?.method ?? 'get').toUpperCase();
      const status = error.response?.status ?? 'no response';
      const url = config ? fullUrl(config) : 'unknown url';

      console.log(`◀── ✗ ${status} ${method} ${url}${elapsed(config)}`);
      console.log('   message:', error.message);
      if (error.response?.data) console.log('   data:', pretty(error.response.data));

      return Promise.reject(error);
    },
  );
}

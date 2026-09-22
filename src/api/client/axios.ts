import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';
import { ENV } from '@/config/env';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  // Repeat the key for array values (?brand=a&brand=b) instead of axios's default
  // bracket form (?brand[]=a). The API and the web client both use repeated keys.
  paramsSerializer: { indexes: null },
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(ENV.IS_DEV ? { 'ngrok-skip-browser-warning': 'true' } : {}),
  },
});

export default apiClient;

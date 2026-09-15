import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';
import { ENV } from '@/config/env';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(ENV.IS_DEV ? { 'ngrok-skip-browser-warning': 'true' } : {}),
  },
});

export default apiClient;

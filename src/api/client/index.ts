import apiClient from './axios';
import { applyAuthInterceptors } from '../interceptors/auth.interceptor';
import { applyErrorInterceptor } from '../interceptors/error.interceptor';

applyAuthInterceptors(apiClient);
applyErrorInterceptor(apiClient);

export { apiClient };

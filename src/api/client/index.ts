import apiClient from './axios';
import { applyAuthInterceptors } from '../interceptors/auth.interceptor';
import { applyErrorInterceptor } from '../interceptors/error.interceptor';
import { applyLoggingInterceptor } from '../interceptors/logging.interceptor';

// Order matters. Axios runs request interceptors last-registered-first and response
// interceptors first-registered-first, so registering logging first means it sees
// the outgoing request *after* the auth header is attached, and the failing response
// *before* the error interceptor flattens it into a plain object.
applyLoggingInterceptor(apiClient);
applyAuthInterceptors(apiClient);
applyErrorInterceptor(apiClient);

export { apiClient };

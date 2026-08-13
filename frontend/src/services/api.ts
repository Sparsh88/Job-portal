import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client-Side In-Memory Cache for fast route navigation & request deduplication
interface CacheEntry {
  response: AxiosResponse<any>;
  timestamp: number;
}

const requestCache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<AxiosResponse<any>>>();
const CLIENT_CACHE_TTL_MS = 20 * 1000; // 20 seconds TTL

export function clearClientCache(): void {
  requestCache.clear();
  pendingRequests.clear();
}

// Request Interceptor: Attach JWT Token & check client cache for GET requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hirehub_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Invalidate client cache if user is performing mutations (POST, PUT, DELETE)
    const method = (config.method || 'get').toLowerCase();
    if (['post', 'put', 'delete', 'patch'].includes(method)) {
      requestCache.clear();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Custom cached GET helper that automatically deduplicates in-flight requests and caches responses
const originalGet = api.get.bind(api);
api.get = function <T = any, R = AxiosResponse<T>, D = any>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  const token = localStorage.getItem('hirehub_token') || 'anon';
  const cacheKey = `${url}:${JSON.stringify(config?.params || {})}:${token}`;

  // Check if fresh cached response is available in memory
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_TTL_MS) {
    return Promise.resolve(cached.response as R);
  }

  // Deduplicate in-flight requests
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<R>;
  }

  const promise = originalGet<T, R, D>(url, config)
    .then((res) => {
      requestCache.set(cacheKey, {
        response: res as AxiosResponse<any>,
        timestamp: Date.now(),
      });
      pendingRequests.delete(cacheKey);
      return res;
    })
    .catch((err) => {
      pendingRequests.delete(cacheKey);
      throw err;
    });

  pendingRequests.set(cacheKey, promise as Promise<any>);
  return promise;
} as any;

// Response Interceptor: Handle Unauthorized / Expired Session
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('hirehub_refresh_token');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
          const newAccessToken = res.data.data.accessToken;
          localStorage.setItem('hirehub_token', newAccessToken);
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        } catch (refreshErr) {
          localStorage.removeItem('hirehub_token');
          localStorage.removeItem('hirehub_refresh_token');
          clearClientCache();
        }
      }
    }
    return Promise.reject(error);
  }
);

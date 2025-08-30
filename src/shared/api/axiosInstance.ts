import axios from 'axios';
import { useAuthStore, type IToken } from '../../app/store/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally handle token attach globally (interceptors)
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token.access}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const token = useAuthStore.getState().token;
    const setAuth = useAuthStore.getState().setAuth;
    const clearAuth = useAuthStore.getState().clearAuth;
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry && token?.refresh) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/refresh`, {
          refresh: token?.refresh,
        });
        const { access, refresh } = (await response.data) as IToken;
        setAuth({ access, refresh });
        originalRequest.headers.Authorization = `Bearer ${access}`;
        console.log('Token refreshed successfully:', access);
        return axiosInstance(originalRequest);
      } catch (error: unknown) {
        clearAuth();
        logError(error, 'Requesting refresh token error');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

const logError = (error: unknown, context = '') => {
  if (axios.isAxiosError(error)) {
    console.log(`${context}:`, error.response?.data?.error || error.message);
  } else if (error instanceof Error) {
    console.log(`${context}:`, error.message);
  } else {
    console.log(`${context}:`, error);
  }
};

export default axiosInstance;

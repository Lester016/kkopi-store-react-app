import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axiosInstance from '../../../api/axiosInstance';
import { useAuthStore } from '../../../app/store';

type LoginPayload = { email: string; password: string };

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setError = useAuthStore((s) => s.setError);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post('/api/login', payload);
      return data;
    },
    onSuccess: (data) => {
      setAuth({ access: data.access, refresh: data.refresh });
      setError(null);
    },
    onError: (err) => {
      const error = err as AxiosError<{ error: string }>;
      setError(error?.response?.data?.error ?? 'Login failed');
    },
  });
};

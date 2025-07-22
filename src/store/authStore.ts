import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

export type DecodedToken = {
  userId: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
};

type AuthState = {
  token: { access: string; refresh: string } | null;
  user: DecodedToken | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      login: async (email: string, password: string) => {
        // Simulate auth API
        set({ loading: true, error: null });
        try {
          const response = await axiosInstance.post('/api/login', { email, password });
          const { user } = jwtDecode(response.data.access) as { user: DecodedToken };
          set({ loading: false, token: response.data, user: user });
        } catch (error: any) {
          set({ loading: false, error: error?.response?.data?.error });
          console.log('Login error:', error);
          throw error;
        }
      },
      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user } as AuthState), // only persist token + user
      onRehydrateStorage: () => (state) => {
        console.log('[rehydrate] running...', state);
        if (state?.token) {
          const decoded = jwtDecode(state.token.access);
          const now = Date.now() / 1000;
          if (!decoded.exp || decoded.exp < now) {
            state.logout(); // Token expired on boot
          }
        }
      },
    }
  )
);

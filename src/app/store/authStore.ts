import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DecodedAccessToken = {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  exp: number;
};

export type IToken = {
  access: string;
  refresh: string;
};

type AuthState = {
  token: IToken | null;
  user: DecodedAccessToken | null;
  loading: boolean;
  error: string | null;
  setAuth: (token: IToken) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      setAuth: ({ access, refresh }) => {
        const { user } = jwtDecode(access) as { user: DecodedAccessToken };
        set({ token: { access, refresh }, user });
      },
      clearAuth: () => {
        set({ token: null, user: null, loading: false, error: null });
      },
      setError: (error: string | null) => set({ error }),
      setLoading: (loading: boolean) => set({ loading }),
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
            state.clearAuth(); // Token expired on boot
          }
        }
      },
    }
  )
);

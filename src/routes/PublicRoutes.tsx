import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
}

export const PublicOnlyRoute = ({ children }: Props) => {
  const token = useAuthStore((state) => state.token);

  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

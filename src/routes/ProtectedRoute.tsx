import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles: Array<'ADMIN' | 'EMPLOYEE'>;
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Logged in but role mismatch → go to 404
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

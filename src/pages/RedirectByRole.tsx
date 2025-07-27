import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RedirectByRole() {
  const user = useAuthStore((s) => s.user);
  // The user comes from the decoded token
  if (!user) return <Navigate to="/login" replace />;
  console.log('RedirectByRole user:', user);
  if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
  if (user.role === 'EMPLOYEE') return <Navigate to="/attendance" replace />;

  return <Navigate to="/not-found" replace />;
}

import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AppLayout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/employees" className="text-gray-700 hover:text-blue-600 font-medium">
              Employees
            </Link>
          </nav>

          <button
            onClick={clearAuth}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Outlet /> {/* Renders child route here */}
      </main>
    </div>
  );
};

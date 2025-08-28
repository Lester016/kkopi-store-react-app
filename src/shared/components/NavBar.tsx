import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const employeeLinks = [{ to: '/', label: 'Home' }];

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
];

const NavBar = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const userRole = useAuthStore((state) => state.user?.role);
  const links = userRole === 'ADMIN' ? adminLinks : employeeLinks;
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => {
            clearAuth();
            navigate('/');
          }}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default NavBar;

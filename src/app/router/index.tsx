import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../../features/admin';
import { UpdateEmployeePage } from '../../features/admin/employee';
import { Login } from '../../features/auth';
import { Attendance } from '../../features/employee';
import CreateEmployee from '../../pages/CreateEmployee';
import Employees from '../../pages/Employees';
import { NotFound } from '../../pages/NotFound';
import SchedulePage from '../../pages/Schedule';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicRoutes';
import RedirectByRole from './RedirectByRole';

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route path="/" element={<RedirectByRole />} />
      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<CreateEmployee />} />
        <Route path="/employees/:id/schedule" element={<SchedulePage />} />
        <Route path="/employees/:id/update" element={<UpdateEmployeePage />} />
      </Route>
      {/* Employee routes */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
        <Route path="/attendance" element={<Attendance />} />
      </Route>
      {/* 404 fallback */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

export default AppRouter;

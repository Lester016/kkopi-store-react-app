import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../../features/auth';
import Attendance from '../../features/employee/attendance/components/Attendance';
import CreateEmployee from '../../pages/CreateEmployee';
import { DashBoard } from '../../pages/DashBoard';
import Employees from '../../pages/Employees';
import { NotFound } from '../../pages/NotFound';
import RedirectByRole from '../../pages/RedirectByRole';
import SchedulePage from '../../pages/Schedule';
import UpdateEmployee from '../../pages/UpdateEmployee';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { PublicOnlyRoute } from '../../routes/PublicRoutes';

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
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<CreateEmployee />} />
        <Route path="/employees/:id/schedule" element={<SchedulePage />} />
        <Route path="/employees/:id/update" element={<UpdateEmployee />} />
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

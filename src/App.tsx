import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppLayout } from './layout/AppLayout';
import Attendance from './pages/Attendance';
import { DashBoard } from './pages/DashBoard';
import Employees from './pages/Employees';
import Login from './pages/Login';
import { NotFound } from './pages/NotFound';
import RedirectByRole from './pages/RedirectByRole';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicOnlyRoute } from './routes/PublicRoutes';

const App = () => {
  return (
    <BrowserRouter>
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
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/employees" element={<Employees />} />
          </Route>
        </Route>
        {/* Employee routes */}
        <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
          <Route element={<AppLayout />}>
            <Route path="/attendance" element={<Attendance />} />
          </Route>
        </Route>
        {/* 404 fallback */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

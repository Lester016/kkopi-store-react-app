import { format, parseISO, startOfWeek } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Pencil } from 'lucide-react'; // lightweight icon for edit
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AttendanceRecord } from '../features/employee';
import AttendanceLogs from '../features/employee/attendance/components/AttendanceLogs';
import axiosInstance from '../shared/api/axiosInstance';

type EmployeeDetails = {
  id: string;
  user: string;
  employeeId: string;
  position: string;
  branch: string;
  startDate: string;
  phone: string;
} | null;

type Employee = {
  role: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  employeeDetails: EmployeeDetails;
  schedule?: {
    weeklySchedule: {
      [day: string]: {
        shiftStart: string;
        shiftEnd: string;
      };
    };
  };
};

type DailyHours = {
  date: string;
  hours: number;
};

type WeeklyHours = {
  weekStart: string;
  total: number;
};

type AttendanceSummary = {
  dailyHours: DailyHours[];
  weeklyHours: WeeklyHours[];
  monthlyTotalHours: number;
};

function filterEmployeeById(employees: Employee[], id: string): Employee | null {
  return employees.find((emp) => emp.id === id) || null;
}

const Employees = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axiosInstance.get<{ employees: Employee[] }>('/api/users');
        const usersData = response.data.employees;
        console.log('Fetched users:', usersData);
        setEmployee(usersData);
        if (usersData.length > 0) {
          setSelectedId(usersData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getAttendanceRecords = async () => {
      try {
        if (!selectedId) return; // No employee selected
        const response = await axiosInstance.get<{ recordsWithUrls: AttendanceRecord[] }>(
          `/api/attendance/records?userId=${selectedId}`
        );
        const attendance = response.data.recordsWithUrls;
        setAttendanceRecords(attendance);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
      }
    };
    getAttendanceRecords();
  }, [selectedId]);

  // Group employees by branch
  const groupedByBranch = useMemo(() => {
    return employee.reduce<Record<string, Employee[]>>((acc, emp) => {
      const branch = emp.employeeDetails?.branch || 'Unassigned';
      if (!acc[branch]) acc[branch] = [];
      acc[branch].push(emp);
      return acc;
    }, {});
  }, [employee]);

  const selected = employee.find((emp) => emp.id === selectedId) || null;

  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  // --- Adjusted Hours Processing ---
  const processAttendanceData = (): AttendanceSummary => {
    const dailyHours: DailyHours[] = attendanceRecords.map((day) => ({
      date: day.date,
      hours: day.totalHours || 0,
    }));

    const weeklyHoursMap: Record<string, number> = {};
    dailyHours.forEach((day) => {
      const weekStart = startOfWeek(parseISO(day.date), { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      if (!weeklyHoursMap[weekKey]) weeklyHoursMap[weekKey] = 0;
      weeklyHoursMap[weekKey] += day.hours;
    });

    const weeklyHours: WeeklyHours[] = Object.keys(weeklyHoursMap).map((weekStart) => ({
      weekStart,
      total: parseFloat(weeklyHoursMap[weekStart].toFixed(2)),
      days: dailyHours.filter((d) => {
        const ws = format(startOfWeek(parseISO(d.date), { weekStartsOn: 1 }), 'yyyy-MM-dd');
        return ws === weekStart;
      }),
    }));

    const monthlyTotalHours = dailyHours.reduce((sum, day) => sum + day.hours, 0);

    return { dailyHours, weeklyHours, monthlyTotalHours };
  };

  // --- USAGE ---
  const { weeklyHours, monthlyTotalHours } = processAttendanceData();
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-80 bg-white/60 backdrop-blur-md shadow-lg p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Team Directory</h2>
          <button
            onClick={() => navigate('/employees/create')}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
          >
            <span className="text-lg leading-none">＋</span> Add
          </button>
        </div>

        {Object.entries(groupedByBranch).map(([branch, branchEmployees]) => (
          <div key={branch} className="mb-6">
            <h3 className="text-sm text-gray-500 uppercase font-semibold mb-2">{branch} Branch</h3>
            <ul className="space-y-3">
              {branchEmployees.map((emp) => (
                <li
                  key={emp.id}
                  onClick={() => setSelectedId(emp.id)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedId === emp.id
                      ? 'bg-blue-100 shadow-md'
                      : 'hover:bg-gray-100 hover:shadow'
                  }`}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      emp.firstName + ' ' + emp.lastName
                    )}&background=random`}
                    alt={`${emp.firstName} ${emp.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-semibold">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      ID: {emp.employeeDetails?.employeeId || 'N/A'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Panel */}
      <main className="flex-1 pl-6 overflow-y-auto">
        {selected ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
            >
              {/* Top Row: Name + Edit Icon, Image on right */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                {/* Left: Name & Contact Info */}
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {selected.firstName} {selected.lastName}
                    </h1>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/employees/${selected.id}/update`)}
                      className="p-1 rounded-full hover:bg-gray-100 transition"
                      title="Edit Employee"
                    >
                      <Pencil size={20} className="text-gray-600" />
                    </motion.button>
                  </div>

                  <p className="text-gray-600 text-lg mt-1">
                    {selected.employeeDetails?.position || 'N/A'} —{' '}
                    {selected.employeeDetails?.branch || 'Unassigned'}
                  </p>

                  {/* Employee ID in contact info area */}
                  {selected.employeeDetails?.employeeId && (
                    <p className="text-sm text-gray-500 mt-1">
                      🆔 ID: {selected.employeeDetails.employeeId}
                    </p>
                  )}

                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-500">📧 {selected.email || 'N/A'}</p>
                    <p className="text-sm text-gray-500">
                      📱 {selected.employeeDetails?.phone || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      📅 Start Date:{' '}
                      {selected.employeeDetails?.startDate
                        ? new Date(selected.employeeDetails.startDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Right: Profile Image */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selected.firstName + ' ' + selected.lastName
                    )}&background=random&size=128`}
                    alt={`${selected.firstName} ${selected.lastName}`}
                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </motion.div>
              </div>

              {/* Schedule Section */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">Weekly Schedule</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      navigate(`/employees/${selected.id}/schedule`, {
                        state: { name: `${selected.firstName} ${selected.lastName}` },
                      })
                    }
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Edit Schedule
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedId &&
                    Object.entries(filterEmployeeById(employee, selectedId)?.schedule || {}).map(
                      ([day, sched], i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          <span className="font-medium text-gray-700">{day}</span>
                          <span className="text-gray-500 text-sm">
                            {sched.shiftStart && sched.shiftEnd
                              ? sched.shiftStart + ' - ' + sched.shiftEnd
                              : 'Off'}
                          </span>
                        </motion.div>
                      )
                    )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AttendanceLogs attendanceRecords={attendanceRecords} />

              {/* Hours Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Hours Summary <span className="text-gray-500 text-sm">(This Month)</span>
                </h2>

                {/* Monthly total */}
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">Total Hours This Month</p>
                  <p className="text-2xl font-bold text-green-700">{monthlyTotalHours} hrs</p>
                </div>

                {/* Weekly breakdown with dropdown */}
                <div className="flex-1 overflow-y-auto max-h-[500px]">
                  {weeklyHours.map((week, idx) => (
                    <div key={idx} className="mb-3 border border-blue-200 rounded-lg">
                      <button
                        className="w-full flex justify-between items-center p-3 bg-blue-50 rounded-lg text-blue-700 font-medium"
                        onClick={() => setExpandedWeek(expandedWeek === idx ? null : idx)}
                      >
                        <span>
                          Week {idx + 1} — {week.total} hrs
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            expandedWeek === idx ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedWeek === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-3 bg-white space-y-2"
                          >
                            {week.days.map((day, dIdx) => (
                              <div
                                key={dIdx}
                                className="flex justify-between text-sm bg-gray-50 p-2 rounded-md"
                              >
                                <span>{day.date}</span>
                                <span className="font-medium">{day.hours} hrs</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-20">Select an employee to view details.</div>
        )}
      </main>
    </div>
  );
};

export default Employees;

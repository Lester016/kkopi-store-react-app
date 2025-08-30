import { motion } from 'framer-motion';
import { Clock, MapPin, Plane, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const DashBoard = () => {
  const [recentClockIns] = useState([
    {
      name: 'John Doe',
      time: '08:55 AM',
      branch: 'New York',
      selfie: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
      name: 'Jane Smith',
      time: '09:02 AM',
      branch: 'Los Angeles',
      selfie: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name: 'Mark Wilson',
      time: '09:10 AM',
      branch: 'Chicago',
      selfie: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      name: 'Emily Davis',
      time: '09:05 AM',
      branch: 'Houston',
      selfie: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      name: 'Chris Lee',
      time: '08:50 AM',
      branch: 'Miami',
      selfie: 'https://randomuser.me/api/portraits/men/12.jpg',
    },
    {
      name: 'Sophia Martinez',
      time: '09:12 AM',
      branch: 'Boston',
      selfie: 'https://randomuser.me/api/portraits/women/82.jpg',
    },
    {
      name: 'Sophia Martinez',
      time: '09:12 AM',
      branch: 'Boston',
      selfie: 'https://randomuser.me/api/portraits/women/82.jpg',
    },
    {
      name: 'Sophia Martinez',
      time: '09:12 AM',
      branch: 'Boston',
      selfie: 'https://randomuser.me/api/portraits/women/82.jpg',
    },
    {
      name: 'Sophia Martinez',
      time: '09:12 AM',
      branch: 'Boston',
      selfie: 'https://randomuser.me/api/portraits/women/82.jpg',
    },
  ]);

  const trendData = [
    { day: 'Mon', present: 45 },
    { day: 'Tue', present: 48 },
    { day: 'Wed', present: 42 },
    { day: 'Thu', present: 50 },
    { day: 'Fri', present: 47 },
  ];

  const branchData = [
    { branch: 'New York', attendance: 95 },
    { branch: 'Los Angeles', attendance: 90 },
    { branch: 'Chicago', attendance: 88 },
    { branch: 'Houston', attendance: 92 },
  ];
  // Example KPI data
  const kpis = [
    {
      label: 'Present',
      value: 120,
      icon: <UserCheck className="text-green-600" size={20} />,
      color: 'bg-green-100',
    },
    {
      label: 'Absent',
      value: 15,
      icon: <UserX className="text-red-600" size={20} />,
      color: 'bg-red-100',
    },
    {
      label: 'Late',
      value: 8,
      icon: <Clock className="text-yellow-600" size={20} />,
      color: 'bg-yellow-100',
    },
    {
      label: 'On Leave',
      value: 5,
      icon: <Plane className="text-blue-600" size={20} />,
      color: 'bg-blue-100',
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className={`p-4 rounded-xl shadow-sm ${kpi.color} flex flex-col items-center`}
          >
            <div className="flex items-center gap-2 mb-2">
              {kpi.icon}
              <span className="text-lg font-bold">{kpi.value}</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Clock-Ins - Scrollable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow p-4 col-span-1 flex flex-col"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Clock-Ins</h2>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '600px' }}>
            {recentClockIns.map((emp, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={emp.selfie}
                  alt={emp.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{emp.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <UserCheck size={14} className="text-green-500" />
                    {emp.time}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={12} />
                    {emp.branch}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Attendance Trends + Branch Breakdown */}
        <div className="col-span-2 space-y-6">
          {/* Attendance Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow p-4"
          >
            <h2 className="text-lg font-semibold mb-4">Attendance Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Branch Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow p-4"
          >
            <h2 className="text-lg font-semibold mb-4">Branch Attendance Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

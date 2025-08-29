import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { AttendanceLog, AttendanceRecord } from '../types/attendance.types';

// Flatten punches into AttendanceLog format
const mapAttendanceLogs = (records: AttendanceRecord[]): AttendanceLog[] => {
  return records.flatMap((day) => {
    const logs: AttendanceLog[] = [];

    if (day.timeIn) {
      logs.push({
        id: `${day._id}-in`,
        shiftDate: day.date,
        dateTime: day.timeIn,
        type: 'In',
        selfie: day.selfieIn || '',
      });
    }

    if (day.timeOut) {
      logs.push({
        id: `${day._id}-out`,
        shiftDate: day.date,
        dateTime: day.timeOut,
        type: 'Out',
        selfie: day.selfieOut || '',
      });
    }

    return logs;
  });
};

const AttendanceLogs = ({ attendanceRecords }: { attendanceRecords: AttendanceRecord[] }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const allLogs = mapAttendanceLogs(attendanceRecords);
  const totalPages = Math.ceil(allLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const logs = allLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Attendance <span className="text-gray-500 text-sm font-normal">(This Month)</span>
      </h2>

      <div className="space-y-4">
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:shadow-sm transition"
          >
            {/* Selfie */}
            <div className="flex-shrink-0">
              <img
                src={log.selfie}
                alt="Selfie"
                className="w-28 h-16 rounded-lg object-cover border border-gray-200"
              />
            </div>

            {/* Date & Time Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                {new Date(log.shiftDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <Clock size={14} className="text-gray-400" />
                {new Date(log.dateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* In/Out Status */}
            <div className="flex items-center gap-1 text-sm font-medium whitespace-nowrap">
              {log.type === 'In' ? (
                <LogIn size={16} className="text-green-500" />
              ) : (
                <LogOut size={16} className="text-red-500" />
              )}
              <span className={log.type === 'In' ? 'text-green-600' : 'text-red-600'}>
                {log.type}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border ${
              currentPage === 1
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border ${
              currentPage === totalPages
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-600 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AttendanceLogs;

import { useAuthStore } from '../../../../app/store/authStore';
import { useAttendance } from '../hooks/useAttendance';
import AttendanceCard from './AttendanceCard';
import AttendanceLogs from './AttendanceLogs';

const Attendance = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const { records, timeIn, timeOut, loading, error, clockIn, clockOut } = useAttendance(userId);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {/* Attendance Action Card */}
      <AttendanceCard
        timeIn={timeIn}
        timeOut={timeOut}
        loading={loading}
        errorMessage={error}
        onClockIn={clockIn}
        onClockOut={clockOut}
      />

      {/* Attendance Logs Section */}
      <AttendanceLogs attendanceRecords={records} />
    </div>
  );
};

export default Attendance;

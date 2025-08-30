// The top-level feature component (what other parts of the app will actually use)
export { default as Attendance } from './attendance/components/Attendance';
export { default as AttendaceLogs } from './attendance/components/AttendanceLogs';

// Export types if they’re useful outside this feature
export type { AttendanceRecord } from './attendance/types/attendance.types';

// The top-level feature component (what other parts of the app will actually use)
export { default as Attendace } from './components/Attendance';
export { default as AttendaceLogs } from './components/AttendanceLogs';

// Export types if they’re useful outside this feature
export type { AttendanceRecord } from './types/attendance.types';

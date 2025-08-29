export type AttendanceRecord = {
  _id: string;
  date: string; // YYYY-MM-DD
  timeIn?: string; // ISO string
  timeOut?: string; // ISO string
  selfieIn?: string; // URL or path to image
  selfieOut?: string; // URL or path to image
  status: 'present' | 'absent' | 'holiday';
  totalHours: number;
  incomplete: boolean; // true if clock out is missing
};

export type AttendanceLog = {
  id: string;
  shiftDate: string; // YYYY-MM-DD
  dateTime: string; // ISO string
  type: 'In' | 'Out';
  selfie: string;
};

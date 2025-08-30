import axiosInstance from '../../../../shared/api/axiosInstance';
import type { AttendanceRecord } from '../types/attendance.types';
import compressImage from '../utils/compressImage';

export async function fetchAttendanceRecords(userId: string) {
  const { data } = await axiosInstance.get<{ recordsWithUrls: AttendanceRecord[] }>(
    `/api/attendance/records`,
    { params: { userId } }
  );
  return data.recordsWithUrls;
}

export async function fetchTodaysAttendance(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await axiosInstance.get<{ recordsWithUrls: AttendanceRecord[] }>(
    `/api/attendance/records`,
    { params: { userId, startDate: today, endDate: today } }
  );
  return data.recordsWithUrls[0] ?? null;
}

export async function submitAttendance(endpoint: string, photo: File | null) {
  const formData = new FormData();

  if (photo) {
    const compressedPhoto = await compressImage(photo);
    formData.append('image', compressedPhoto, compressedPhoto.name || 'photo.jpg');
  }

  await axiosInstance.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

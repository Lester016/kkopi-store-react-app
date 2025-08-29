import type { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  fetchAttendanceRecords,
  fetchTodaysAttendance,
  submitAttendance,
} from '../services/attendanceApi';
import type { AttendanceRecord } from '../types/attendance.types';

export function useAttendance(userId: string | undefined) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [timeIn, setTimeIn] = useState<string | null>(null);
  const [timeOut, setTimeOut] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshRecords = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await fetchAttendanceRecords(userId);
      setRecords(data);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || 'Failed to fetch attendance.');
    }
  }, [userId]);

  const refreshToday = useCallback(async () => {
    if (!userId) return;
    try {
      const today = await fetchTodaysAttendance(userId);
      setTimeIn(today?.timeIn ?? null);
      setTimeOut(today?.timeOut ?? null);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || 'Failed to fetch today’s attendance.');
    }
  }, [userId]);

  const clockIn = async (photo: File | null) => {
    console.log('Clock In Triggered');
    if (!userId) return;
    setLoading(true);
    try {
      await submitAttendance('/api/attendance/check-in', photo);
      await refreshToday();
      await refreshRecords();
      setError(null);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || 'An error occurred while checking in.');
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async (photo: File | null) => {
    if (!userId) return;
    setLoading(true);
    try {
      await submitAttendance('/api/attendance/check-out', photo);
      await refreshToday();
      await refreshRecords();
      setError(null);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || 'An error occurred while checking out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRecords();
    refreshToday();
  }, [refreshRecords, refreshToday]);

  return {
    records,
    timeIn,
    timeOut,
    loading,
    error,
    clockIn,
    clockOut,
  };
}

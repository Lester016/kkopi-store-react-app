import type { AxiosError } from 'axios';
import { useState } from 'react';
import { deleteEmployee } from '../services/employeeApi';

export const useDeleteEmployee = (id: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (onSuccess: () => void) => {
    try {
      setLoading(true);
      await deleteEmployee(id!);
      setError(null);
      onSuccess();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setError(err?.response?.data?.message || 'Failed to delete employee.');
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

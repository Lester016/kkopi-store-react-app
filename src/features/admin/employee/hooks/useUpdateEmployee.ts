import type { AxiosError } from 'axios';
import { useState } from 'react';
import { updateEmployee } from '../services/employeeApi';
import type { EmployeeFormInputs } from '../types/employee.types';

export const useUpdateEmployee = (id: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data: EmployeeFormInputs, onSuccess: () => void) => {
    try {
      setLoading(true);
      if (!data.password) delete data.password;
      await updateEmployee(id!, data);
      setError(null);
      onSuccess();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setError(err?.response?.data?.message || 'Failed to update employee.');
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

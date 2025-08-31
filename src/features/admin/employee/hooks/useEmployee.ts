import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { getEmployee } from '../services/employeeApi';
import type { EmployeeFormInputs } from '../types/employee.types';

export const useEmployee = (id: string | undefined) => {
  const [data, setData] = useState<EmployeeFormInputs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const user = await getEmployee(id);
        const { email, firstName, lastName } = user;
        const { position, branch, startDate, phone } = user.employeeDetails;

        setData({ email, firstName, lastName, position, branch, startDate, phone });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        setError(err.response?.data?.message || 'An error occurred while updating user.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return { data, loading, error };
};

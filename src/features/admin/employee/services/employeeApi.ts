import axiosInstance from '../../../../shared/api/axiosInstance';
import type { Employee, EmployeeFormInputs } from '../types/employee.types';

export const getEmployee = async (id: string): Promise<Employee> => {
  const res = await axiosInstance.get(`/api/users/${id}`);
  return res.data.user;
};

export const updateEmployee = async (id: string, data: Partial<EmployeeFormInputs>) => {
  return axiosInstance.put(`/api/users/${id}`, data);
};

export const deleteEmployee = async (id: string) => {
  return axiosInstance.delete(`/api/users/${id}`);
};

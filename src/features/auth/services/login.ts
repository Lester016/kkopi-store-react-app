import axiosInstance from '../../../shared/api/axiosInstance';
import type { LoginFormInputs } from '../types/login.types';

export const login = async (payload: LoginFormInputs) => {
  const { data } = await axiosInstance.post('/api/login', payload);
  return data; // { access, refresh }
};

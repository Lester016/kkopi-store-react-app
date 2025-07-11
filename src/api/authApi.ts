import type { LoginFormInputs } from "../types/auth";
import axiosInstance from "./axiosInstance";

export const login = async (data: LoginFormInputs) => {
  const response = await axiosInstance.post("/api/login", data);
  return response.data; // Usually returns user + token
};
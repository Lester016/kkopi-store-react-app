import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally handle token attach globally (interceptors)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Or use context/store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
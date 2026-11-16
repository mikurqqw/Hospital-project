import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || "/api" });
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.data && typeof error.response.data.detail !== "string") {
    error.response.data.detail = "Проверьте введённые данные и повторите запрос.";
  }
  return Promise.reject(error);
});
export default api;

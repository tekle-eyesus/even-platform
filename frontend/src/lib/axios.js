import axios from "axios";
import { API_URL } from "../config/env";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial: Allows backend to set HttpOnly cookies (RefreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Attach Access Token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

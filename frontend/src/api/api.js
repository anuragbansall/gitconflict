import axios from "axios";
import { authClient } from "../lib/auth";

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error(
    "VITE_BACKEND_URL is not defined in the environment variables.",
  );
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const result = await authClient.getSession();
    const token = result.data?.session?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // unauthenticated request, continue without token
  }
  return config;
});

export default api;

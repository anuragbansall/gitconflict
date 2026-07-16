import axios from "axios";

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
  withCredentials: true,
});

export default api;

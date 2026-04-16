import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Handle errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.clear();
      // Use import.meta.env.BASE_URL to respect the vite base path
      window.location.href = (import.meta.env.BASE_URL || "/") + "login";
    }
    return Promise.reject(err);
  }
);

export default api;
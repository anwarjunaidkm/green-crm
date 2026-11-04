import axios from "axios";

// 1. Axios instance with environment base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://16.178.48.198/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Attach auth token automatically if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      sessionStorage.getItem("greenvedha_token") ||
      localStorage.getItem("greenvedha_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

import axios from "axios";

// 1. Normalize Base URL to always point to /api/v1
const rawBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.sidharthsoman.online/api/v1";

const baseURL = rawBase.endsWith("/api/v1")
  ? rawBase
  : `${rawBase.replace(/\/$/, "")}/api/v1`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. Interceptor to attach token & strip duplicate /api/v1 prefix
api.interceptors.request.use((config) => {
  if (config.url?.startsWith("/api/v1/")) {
    config.url = config.url.replace("/api/v1/", "/");
  }

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

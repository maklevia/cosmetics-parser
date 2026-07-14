import axios from "axios";
import type { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.config.url !== "/auth/refresh"
    ) {
      try {
        await api.post("/auth/refresh");
        return api(error.config);
      } catch {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

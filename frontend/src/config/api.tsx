import { getEnvOrThrow } from "@fe/utils/getEnvOrThrow";
import axios from "axios";
import type { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: getEnvOrThrow('API_ORIGIN'),
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
        if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

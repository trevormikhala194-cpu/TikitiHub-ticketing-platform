import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  saveAuth,
  clearAuth,
} from "../utils/auth";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});


// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {

    const token = getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =========================
// RESPONSE INTERCEPTOR
// =========================

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // Only handle 401 once
    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = getRefreshToken();

    // No refresh token available
    if (!refreshToken) {

      clearAuth();

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    try {

      // =========================
      // REQUEST NEW ACCESS TOKEN
      // =========================

      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken =
        response.data.access;

      if (!newAccessToken) {
        throw new Error(
          "No access token returned."
        );
      }

      // =========================
      // SAVE NEW ACCESS TOKEN
      // =========================

      saveAuth({
        access: newAccessToken,
        refresh: refreshToken,
      });

      // =========================
      // RETRY ORIGINAL REQUEST
      // =========================

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);

    } catch (refreshError) {

      console.error(
        "Token refresh failed:",
        refreshError
      );

      clearAuth();

      if (
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return Promise.reject(
        refreshError
      );
    }
  }
);


export default api;
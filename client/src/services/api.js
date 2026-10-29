import axios from "axios";

// API URL for development and production
// Priority: VITE_API_URL -> localhost in dev -> Render in production
const resolveBaseURL = () => {
  const env =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env
      : (typeof process !== "undefined" ? process.env : {});

  if (env?.VITE_API_URL) {
    return env.VITE_API_URL;
  }
  return env?.DEV
    ? "http://localhost:5000/api"
    : "https://smart-code-translator.onrender.com/api";
};

const API = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Identify public authentication endpoints that must not send Bearer tokens or trigger auth redirect
const isAuthRequest = (url = "") =>
  /(^|\/)auth\/(login|register|google)(?:\?|$)/.test(url);

// Request interceptor: Attach JWT Bearer token only to protected requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && !isAuthRequest(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Format human-readable error messages distinguishing CORS, network, timeout, and HTTP status codes
export const formatApiErrorMessage = (error) => {
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return "Request timed out. The server took too long to respond.";
  }

  if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
    return "Cannot connect to server. Please check your network connection or verify that the backend is running.";
  }

  const serverMsg = error.response?.data?.message;
  if (serverMsg) return serverMsg;

  const status = error.response?.status;
  switch (status) {
    case 400:
      return "Invalid request. Please check the provided information.";
    case 401:
      return "Invalid email or password.";
    case 403:
      return "Access denied. Origin or credentials not allowed.";
    case 404:
      return "The requested endpoint was not found.";
    case 409:
      return "An account with this email already exists.";
    case 500:
    case 502:
    case 503:
      return "Server error. Please try again in a few moments.";
    default:
      return error.message || "An unexpected error occurred.";
  }
};

// Response interceptor: Handle errors without breaking public auth routes or creating redirect loops
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Attach user-friendly formatted message
    error.formattedMessage = formatApiErrorMessage(error);

    // Only clear token and redirect to login if an authenticated request failed with 401
    // (Never redirect for login/register failures)
    if (status === 401 && !isAuthRequest(url)) {
      localStorage.removeItem("token");

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default API;
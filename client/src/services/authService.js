import API from "./api.js";

// 🔹 Helper for safe API calls
const handleRequest = async (promise, label) => {
  try {
    const response = await promise;
    return response?.data?.data || null;
  } catch (error) {
    console.error(`${label} Error:`, error);
    throw error;
  }
};

// 🔹 Register
const register = (name, email, password) => {
  return handleRequest(
    API.post("/auth/register", { name, email, password }),
    "Register"
  );
};

// 🔹 Email Login
const emailLogin = (email, password) => {
  return handleRequest(
    API.post("/auth/login", { email, password }),
    "Email Login"
  );
};

// 🔹 Google Login
const googleLogin = (credential) => {
  return handleRequest(
    API.post("/auth/google", { credential }),
    "Google Login"
  );
};

// 🔹 Get current user
const getMe = () => {
  return handleRequest(
    API.get("/auth/me"),
    "GetMe"
  );
};

// 🔹 Logout
const logout = async () => {
  try {
    const response = await API.post("/auth/logout");
    return response?.data;
  } catch (error) {
    console.warn("Logout API failed:", error);
    return null; // logout should not block UI
  }
};

export { register, emailLogin, googleLogin, getMe, logout };
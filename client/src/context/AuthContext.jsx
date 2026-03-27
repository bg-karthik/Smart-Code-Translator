import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/authService.js";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const userData = await getMe();

        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.warn("Auth check failed:", error);
        localStorage.removeItem("token");

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // ✅ prevent memory leak
    };
  }, []);

  // 🔹 Login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // 🔹 Logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
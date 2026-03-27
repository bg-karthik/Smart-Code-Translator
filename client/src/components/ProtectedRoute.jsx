import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🔹 Show loader while checking auth
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  // 🔹 If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔹 If logged in → render protected content
  return <>{children}</>;
}

export default ProtectedRoute;
import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { logout as logoutAPI } from "../services/authService.js";
import toast from "react-hot-toast";
import "../styles/navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Active route
  const isActive = (path) => location.pathname === path;

  // 🔹 Detect page
  const isHistory = location.pathname === "/history";

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.warn("Logout API failed:", err);
    }

    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isHistory ? "navbar-history" : "navbar-editor"}`}>
      {/* LEFT */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          CodeTranslator
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${isActive("/") ? "active" : ""}`}
          >
            Editor
          </Link>

          <Link
            to="/history"
            className={`navbar-link ${isActive("/history") ? "active" : ""}`}
          >
            History
          </Link>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* Avatar */}
        {user?.picture ? (
          <img
            src={user.picture}
            alt="user"
            className="navbar-avatar"
          />
        ) : (
          <div className="navbar-avatar placeholder">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {/* Username */}
        <span className="navbar-username">
          {user?.name || "User"}
        </span>

        {/* Logout */}
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
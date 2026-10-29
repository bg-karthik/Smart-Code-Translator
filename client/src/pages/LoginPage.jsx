import { useState, useContext } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  register,
  emailLogin,
  googleLogin,
} from "../services/authService.js";
import "../styles/login.css";

const features = [
  { icon: "</>", title: "Code Translation", desc: "Translate between languages" },
  { icon: "Cx", title: "Complexity Analysis", desc: "Time & space insights" },
  { icon: "#", title: "AI Optimization", desc: "Smart improvements" },
  { icon: "?", title: "Code Explanation", desc: "Understand easily" },
];

function LoginPage() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Redirect back after login
  const from = location.state?.from?.pathname || "/";

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const hasGoogleAuth = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // 🔹 If already logged in
  if (user) return <Navigate to={from} replace />;

  // 🔹 Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = (email || "").trim();
    // Validation
    if (!trimmedEmail || !password) {
      return toast.error("Please fill in all required fields.");
    }

    if (isSignUp && !name.trim()) {
      return toast.error("Please enter your name.");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const result = isSignUp
        ? await register(name.trim(), trimmedEmail, password)
        : await emailLogin(trimmedEmail, password);

      login(result.token, result.user);
      toast.success(
        isSignUp
          ? `Welcome, ${result.user.name}!`
          : `Welcome back, ${result.user.name}!`
      );
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Auth error:", err);
      const message =
        err.formattedMessage ||
        err.response?.data?.message ||
        "Authentication failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      return toast.error("Google login failed: No credential received.");
    }

    try {
      const result = await googleLogin(credentialResponse.credential);
      login(result.token, result.user);
      toast.success(`Welcome, ${result.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Google Auth error:", err);
      const message =
        err.formattedMessage ||
        err.response?.data?.message ||
        "Google authentication failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <div>
          <div className="login-logo">
            <div className="login-logo-icon">{`</>`}</div>
            <span className="login-logo-text">CodeTranslator</span>
          </div>

          <h1 className="login-hero-title">
            Translate, Analyze & Optimize Your Code
          </h1>

          <p className="login-hero-subtitle">
            AI-powered code assistant to work across programming languages.
          </p>

          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="login-feature-card">
                <div className="login-feature-icon">{f.icon}</div>
                <div>
                  <div className="login-feature-title">{f.title}</div>
                  <div className="login-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-footer">
            Powered by AI. Built for developers.
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-form">
          <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>

          <p className="login-form-subtitle">
            {isSignUp
              ? "Create your account to get started"
              : "Enter your credentials to continue"}
          </p>

          {/* 🔹 Email form */}
          <form className="login-email-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <input
                type="text"
                className="login-input"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            )}

            <input
              type="email"
              className="login-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignUp
                ? "Sign Up"
                : "Sign In"}
            </button>
          </form>

          {/* 🔹 Toggle */}
          <p className="login-toggle">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="login-toggle-btn"
                  onClick={() => {
                    setIsSignUp(false);
                    setName("");
                    setPassword("");
                  }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="login-toggle-btn"
                  onClick={() => {
                    setIsSignUp(true);
                    setName("");
                    setPassword("");
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </p>

          {/* Divider */}
          <div className="login-divider">
            <span>or</span>
          </div>

          {/* 🔹 Google login */}
          <div className="login-google-wrapper">
            {hasGoogleAuth ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  toast.error(
                    "Google login failed. Ensure popups are allowed and origin is authorized."
                  )
                }
                theme="outline"
                shape="rectangular"
                size="large"
                text="continue_with"
                width="300"
              />
            ) : (
              <p style={{ fontSize: "12px", color: "#888" }}>
                Google Sign-In is unavailable (Missing VITE_GOOGLE_CLIENT_ID).
              </p>
            )}
          </div>

          <p className="login-terms">
            By continuing you agree to Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
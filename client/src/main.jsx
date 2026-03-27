import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

// 🔹 Get Google Client ID
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// ❗ Warn if missing
if (!googleClientId) {
  console.warn("⚠ VITE_GOOGLE_CLIENT_ID is not set. Google login will not work.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ Only wrap if client ID exists */}
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{ duration: 3000 }}
            />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    ) : (
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{ duration: 3000 }}
          />
        </AuthProvider>
      </BrowserRouter>
    )}
  </React.StrictMode>
);
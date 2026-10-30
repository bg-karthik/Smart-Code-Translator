import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { AuthContext, AuthProvider } from "../context/AuthContext.jsx";
import * as authService from "../services/authService.js";

// Mock @react-oauth/google
vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <div data-testid="mock-google-login">
      <button onClick={() => onSuccess({ credential: "mock_google_token" })}>
        Simulate Google Success
      </button>
      <button onClick={() => onError && onError()}>
        Simulate Google Error
      </button>
    </div>
  ),
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Frontend Authentication & Protected Route Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("1. LoginPage renders sign in form with email and password inputs", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("2. Form rejects submission when required fields are empty", async () => {
    const toast = (await import("react-hot-toast")).default;

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/please fill in all required fields/i)
    );
  });

  it("3. Form toggles to Sign Up mode and requires full name", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument();
  });

  it("4. ProtectedRoute redirects unauthenticated users to /login", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthContext.Provider
          value={{
            user: null,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Secret Dashboard Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page Route</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/secret dashboard content/i)).not.toBeInTheDocument();
    expect(screen.getByText(/login page route/i)).toBeInTheDocument();
  });

  it("5. ProtectedRoute renders children when user is authenticated", () => {
    const mockUser = { id: "123", email: "user@example.com", name: "Alice" };

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthContext.Provider
          value={{
            user: mockUser,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <ProtectedRoute>
            <div>Secret Dashboard Content</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/secret dashboard content/i)).toBeInTheDocument();
  });

  it("6. Google login simulates success and delegates to authService", async () => {
    const spyGoogleLogin = vi.spyOn(authService, "googleLogin").mockResolvedValue({
      token: "mock_jwt_token",
      user: { id: "g123", name: "Google User", email: "guser@example.com" },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    const googleBtn = screen.getByText(/simulate google success/i);
    fireEvent.click(googleBtn);

    await waitFor(() => {
      expect(spyGoogleLogin).toHaveBeenCalledWith("mock_google_token");
    });
  });

  it("7. Google login error triggers error toast", async () => {
    const toast = (await import("react-hot-toast")).default;

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    const googleErrBtn = screen.getByText(/simulate google error/i);
    fireEvent.click(googleErrBtn);

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/google login failed/i)
    );
  });
});

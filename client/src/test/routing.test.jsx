import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

// Mock child pages
vi.mock("../pages/LoginPage.jsx", () => ({
  default: () => <div data-testid="page-login">Login Page View</div>,
}));

vi.mock("../pages/HomePage.jsx", () => ({
  default: () => <div data-testid="page-home">Home Page View</div>,
}));

vi.mock("../pages/HistoryPage.jsx", () => ({
  default: () => <div data-testid="page-history">History Page View</div>,
}));

describe("Frontend SPA Routing & Fallback Tests", () => {
  it("1. Direct navigation to /login renders LoginPage", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthContext.Provider
          value={{
            user: null,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("page-login")).toBeInTheDocument();
  });

  it("2. Direct navigation to / with authenticated user renders HomePage", () => {
    const mockUser = { id: "123", name: "Alice", email: "alice@example.com" };

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthContext.Provider
          value={{
            user: mockUser,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("page-home")).toBeInTheDocument();
  });

  it("3. Direct navigation to /history with authenticated user renders HistoryPage", () => {
    const mockUser = { id: "123", name: "Alice", email: "alice@example.com" };

    render(
      <MemoryRouter initialEntries={["/history"]}>
        <AuthContext.Provider
          value={{
            user: mockUser,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("page-history")).toBeInTheDocument();
  });

  it("4. Unknown route wildcard * redirects to / and displays HomePage", () => {
    const mockUser = { id: "123", name: "Alice", email: "alice@example.com" };

    render(
      <MemoryRouter initialEntries={["/some/random/unmatched/route"]}>
        <AuthContext.Provider
          value={{
            user: mockUser,
            loading: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId("page-home")).toBeInTheDocument();
  });
});

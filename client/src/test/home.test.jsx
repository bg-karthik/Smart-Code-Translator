import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "../pages/HomePage.jsx";
import * as codeService from "../services/codeService.js";

// Mock Monaco Editor
vi.mock("@monaco-editor/react", () => ({
  default: ({ value, onChange, options }) => (
    <textarea
      data-testid="mock-monaco-editor"
      value={value || ""}
      readOnly={options?.readOnly}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Frontend Home Page & Code Translation Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. HomePage renders action tabs, language selectors, and run button", () => {
    render(<HomePage />);

    expect(screen.getByRole("button", { name: /^translate$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^analyze$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^optimize$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^explain$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^run$/i })).toBeInTheDocument();
  });

  it("2. Swapping languages reverses source and target languages", () => {
    render(<HomePage />);

    const swapBtn = screen.getByTitle(/swap languages/i);
    fireEvent.click(swapBtn);

    // Initial source was python, target was java
    // After swap, source should be java, target should be python
    const selects = screen.getAllByRole("combobox");
    expect(selects[0]).toHaveValue("java");
    expect(selects[1]).toHaveValue("python");
  });

  it("3. Running translation invokes translateCode and displays output in editor", async () => {
    const spyTranslate = vi.spyOn(codeService, "translateCode").mockResolvedValue({
      translatedCode: 'public class Main { public static void main(String[] args) { System.out.println("Hello"); } }',
    });

    render(<HomePage />);

    const runBtn = screen.getByRole("button", { name: /^run$/i });
    fireEvent.click(runBtn);

    expect(screen.getAllByText(/running\.\.\./i).length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(spyTranslate).toHaveBeenCalled();
    });

    // Output editor should render translated code
    const editors = screen.getAllByTestId("mock-monaco-editor");
    expect(editors.length).toBe(2); // Source + Output
    expect(editors[1].value).toContain("public class Main");
  });

  it("4. API failure triggers error toast and removes loading spinner", async () => {
    const toast = (await import("react-hot-toast")).default;
    vi.spyOn(codeService, "translateCode").mockRejectedValue(
      new Error("Gemini AI quota exceeded")
    );

    render(<HomePage />);

    const runBtn = screen.getByRole("button", { name: /^run$/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Gemini AI quota exceeded");
    });

    expect(screen.queryByText(/running\.\.\./i)).not.toBeInTheDocument();
  });

  it("5. Copy button copies output text to clipboard with feedback", async () => {
    vi.spyOn(codeService, "translateCode").mockResolvedValue({
      translatedCode: 'print("translated output")',
    });

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<HomePage />);

    const runBtn = screen.getByRole("button", { name: /^run$/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    });

    const copyBtn = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('print("translated output")');
    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });
});

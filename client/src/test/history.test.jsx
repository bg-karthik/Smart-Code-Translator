import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HistoryPage from "../pages/HistoryPage.jsx";
import HistoryList from "../components/HistoryList.jsx";
import * as historyService from "../services/historyService.js";

// Mock Monaco Editor
vi.mock("@monaco-editor/react", () => ({
  default: ({ value }) => <div data-testid="mock-monaco-editor">{value}</div>,
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Frontend History Page & Pagination Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleEntries = [
    {
      _id: "hist_1",
      type: "translate",
      sourceLanguage: "python",
      targetLanguage: "java",
      inputCode: "print('hello')",
      output: { translatedCode: 'System.out.println("hello");' },
      createdAt: new Date().toISOString(),
    },
    {
      _id: "hist_2",
      type: "analyze",
      sourceLanguage: "python",
      inputCode: "for x in range(n): pass",
      output: { timeComplexity: "O(n)", spaceComplexity: "O(1)", explanation: "Single loop" },
      createdAt: new Date().toISOString(),
    },
  ];

  it("1. HistoryList renders empty message when no entries exist", () => {
    render(<HistoryList entries={[]} onView={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no history yet/i)).toBeInTheDocument();
  });

  it("2. HistoryList renders list items with type, languages, and delete buttons", () => {
    const onView = vi.fn();
    const onDelete = vi.fn();

    render(<HistoryList entries={sampleEntries} onView={onView} onDelete={onDelete} />);

    expect(screen.getByText(/translate/i)).toBeInTheDocument();
    expect(screen.getByText(/python → java/i)).toBeInTheDocument();
    expect(screen.getByText(/analyze/i)).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBe(2);

    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith("hist_1");
  });

  it("3. HistoryPage fetches and renders paginated entries", async () => {
    vi.spyOn(historyService, "getHistory").mockResolvedValue({
      entries: sampleEntries,
      totalEntries: 2,
      totalPages: 1,
      currentPage: 1,
    });

    render(<HistoryPage />);

    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/history/i)).toBeInTheDocument();
      expect(screen.getByText(/\(2\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/python → java/i)).toBeInTheDocument();
  });

  it("4. Selecting an entry renders detail panel with input and output", async () => {
    vi.spyOn(historyService, "getHistory").mockResolvedValue({
      entries: sampleEntries,
      totalEntries: 2,
      totalPages: 1,
      currentPage: 1,
    });

    render(<HistoryPage />);

    await waitFor(() => {
      expect(screen.getByText(/python → java/i)).toBeInTheDocument();
    });

    // Click item to view detail
    const item = screen.getByText(/python → java/i);
    fireEvent.click(item);

    // Detail panel displays code
    await waitFor(() => {
      expect(screen.getByText(/system\.out\.println\("hello"\);/i)).toBeInTheDocument();
    });

    // Close button dismisses detail panel
    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);

    expect(screen.getByText(/select an entry to view details/i)).toBeInTheDocument();
  });
});

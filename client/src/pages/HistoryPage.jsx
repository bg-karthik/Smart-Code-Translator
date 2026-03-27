import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import HistoryList from "../components/HistoryList.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
} from "../services/historyService.js";
import "../styles/history.css";

function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const LIMIT = 8;

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await getHistory(currentPage, LIMIT);
        const data = res?.data || res;

        if (!isMounted) return;

        setEntries(data.entries || []);
        setTotalPages(data.totalPages || 1);
        setTotalEntries(data.totalEntries || 0);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load history");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      toast.success("Deleted");

      // ✅ Auto adjust page if last item removed
      if (entries.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      } else {
        setEntries((prev) => prev.filter((e) => e._id !== id));
      }

      if (selectedEntry?._id === id) {
        setSelectedEntry(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all history? This cannot be undone.")) return;

    try {
      await clearHistory();
      toast.success("History cleared");

      setEntries([]);
      setSelectedEntry(null);
      setTotalPages(1);
      setTotalEntries(0);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear history");
    }
  };

  return (
    <div className="history-page">
      {/* Sidebar */}
      <div className="history-sidebar">
        <div className="history-sidebar-header">
          <div>
            <span className="history-title">History</span>
            <span className="history-count">({totalEntries})</span>
          </div>

          {totalEntries > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear all
            </button>
          )}
        </div>

        <div className="history-list-container">
          {loading ? (
            <div className="history-empty">Loading...</div>
          ) : entries.length === 0 ? (
            <div className="history-empty">No history yet</div>
          ) : (
            <HistoryList
              entries={entries}
              onView={setSelectedEntry}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="history-pagination">
            <button
              className="page-btn"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${currentPage === p ? "active" : ""}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedEntry ? (
        <div className="history-detail">
          <div className="history-detail-header">
            <div className="detail-header-left">
              <span className="detail-type">
                {selectedEntry.type || "N/A"}
              </span>

              <span className="detail-date">
                {selectedEntry.createdAt
                  ? new Date(selectedEntry.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>

            <button
              className="detail-close-btn"
              onClick={() => setSelectedEntry(null)}
            >
              Close
            </button>
          </div>

          <div className="history-detail-content">
            {/* Input */}
            <div className="detail-section">
              <div className="detail-section-label">
                Input
                <span className="detail-lang-badge">
                  {selectedEntry.sourceLanguage || "N/A"}
                </span>
              </div>

              <div className="detail-editor-container">
                <CodeEditor
                  code={selectedEntry.inputCode || ""}
                  onChange={() => {}}
                  language={selectedEntry.sourceLanguage}
                  readOnly
                />
              </div>
            </div>

            {/* Output */}
            <div className="detail-section">
              <div className="detail-section-label">Output</div>

              <div className="detail-output-box">
                {selectedEntry.type === "translate" && (
                  <>
                    <span className="detail-lang-badge detail-lang-badge-block">
                      Target: {selectedEntry.targetLanguage || "N/A"}
                    </span>

                    <pre className="detail-code-block">
                      {selectedEntry.output?.translatedCode || "No output"}
                    </pre>
                  </>
                )}

                {selectedEntry.type === "analyze" && (
                  <>
                    <div className="detail-complexity-row">
                      <div className="detail-complexity-card">
                        <div className="detail-complexity-label">
                          Time Complexity
                        </div>
                        <div className="detail-complexity-value">
                          {selectedEntry.output?.timeComplexity || "N/A"}
                        </div>
                      </div>

                      <div className="detail-complexity-card">
                        <div className="detail-complexity-label">
                          Space Complexity
                        </div>
                        <div className="detail-complexity-value">
                          {selectedEntry.output?.spaceComplexity || "N/A"}
                        </div>
                      </div>
                    </div>

                    <p className="detail-text">
                      {selectedEntry.output?.explanation ||
                        "No explanation available"}
                    </p>
                  </>
                )}

                {selectedEntry.type === "optimize" && (
                  <>
                    <pre className="detail-code-block">
                      {selectedEntry.output?.optimizedCode || "No output"}
                    </pre>

                    {selectedEntry.output?.suggestions && (
                      <p className="detail-text detail-text-top">
                        {selectedEntry.output.suggestions}
                      </p>
                    )}
                  </>
                )}

                {selectedEntry.type === "explain" && (
                  <p className="detail-text">
                    {selectedEntry.output?.explanation ||
                      "No explanation available"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="history-detail-empty">
          Select an entry to view details
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
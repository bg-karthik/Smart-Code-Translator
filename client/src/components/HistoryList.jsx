import "../styles/history.css";

function HistoryList({ entries = [], onView, onDelete }) {
  if (!entries.length) {
    return <div className="history-empty">No history yet</div>;
  }

  return (
    <div>
      {entries.map((entry) => {
        if (!entry?._id) return null; // ✅ safe guard

        const {
          _id,
          type,
          sourceLanguage,
          targetLanguage,
          createdAt,
        } = entry;

        return (
          <div
            key={_id} // ✅ FIXED
            className="history-item"
            onClick={() => onView?.(entry)}
          >
            {/* Left */}
            <div className="history-item-left">
              <span className="history-item-type">
                {type || "unknown"}
              </span>

              <span className="history-item-langs">
                {sourceLanguage || "?"}
                {targetLanguage ? ` → ${targetLanguage}` : ""}
              </span>
            </div>

            {/* Right */}
            <div className="history-item-right">
              <span className="history-item-date">
                {createdAt
                  ? new Date(createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </span>

              <button
                className="history-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(_id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryList;
import { useEffect } from "react";
import CodeEditor from "./CodeEditor.jsx";
import "../styles/output.css";

function InfoCard({ label, value }) {
  return (
    <div className="info-card">
      <span className="info-card-label">{label}</span>
      <span className="info-card-value">{value || "N/A"}</span>
    </div>
  );
}

function OutputPanel({ result, action, targetLanguage }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => clearTimeout(timer);
  }, [result]);

  // 🔹 Empty state
  if (!result) {
    return (
      <div className="empty-state">
        <p>
          Write code, pick an action, and hit <span>Run</span>
        </p>
      </div>
    );
  }

  // 🔹 TRANSLATE
  if (action === "translate") {
    const code = result?.translatedCode || "";

    return (
      <div className="output-editor-wrap">
        <CodeEditor
          code={code}
          onChange={() => {}}
          language={targetLanguage}
          readOnly={true}
        />
      </div>
    );
  }

  // 🔹 ANALYZE
  if (action === "analyze") {
    return (
      <div className="output-analyze">
        <div className="info-cards-row">
          <InfoCard
            label="Time Complexity"
            value={result?.timeComplexity}
          />
          <InfoCard
            label="Space Complexity"
            value={result?.spaceComplexity}
          />
        </div>

        <div className="output-explanation">
          <p>{result?.explanation || "No explanation available."}</p>
        </div>
      </div>
    );
  }

  // 🔹 OPTIMIZE
  if (action === "optimize") {
    const code = result?.optimizedCode || "";

    return (
      <div className="output-optimize output-flex-col">
        <div className="output-editor-wrap">
          <CodeEditor
            code={code}
            onChange={() => {}}
            language={targetLanguage}
            readOnly={true}
          />
        </div>

        {result?.suggestions && (
          <div className="output-suggestions">
            <h4>Suggestions</h4>
            <pre>{result.suggestions}</pre>
          </div>
        )}
      </div>
    );
  }

  // 🔹 EXPLAIN
  if (action === "explain") {
    return (
      <div className="output-explanation">
        <p>{result?.explanation || "No explanation available."}</p>
      </div>
    );
  }

  return null;
}

export default OutputPanel;
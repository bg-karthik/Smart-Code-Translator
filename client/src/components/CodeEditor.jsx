import { useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import { MONACO_LANGUAGE_MAP } from "../constants/languages.js";

function CodeEditor({ code, onChange, language, readOnly = false }) {
  const editorRef = useRef(null);

  // 🔹 Handle editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    // 🔥 Force layout fix (prevents blank editor)
    setTimeout(() => {
      editor.layout();
    }, 100);
  };

  // 🔹 Handle change safely
  const handleChange = useCallback(
    (value) => {
      if (onChange) onChange(value || "");
    },
    [onChange]
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Editor
        height="100%"          // 🔥 FIX: prevents invisible editor
        width="100%"
        language={MONACO_LANGUAGE_MAP?.[language] || "plaintext"}
        value={code || ""}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"

        // 🔹 Loading fallback
        loading={<div style={{ padding: "10px" }}>Loading editor...</div>}

        options={{
          readOnly,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          folding: true,
          lineNumbers: "on",
          wordWrap: "on",

          // UX polish
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          padding: { top: 10, bottom: 10 },

          // formatting
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;
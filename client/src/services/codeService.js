import API from "./api.js";

// 🔹 Helper for safe API calls
const handleRequest = async (promise, label) => {
  try {
    const response = await promise;
    return response?.data?.data || null;
  } catch (error) {
    console.error(`${label} Error:`, error);

    // ✅ Better error message fallback
    const message =
      error.response?.data?.message ||
      `${label} request failed`;

    throw new Error(message);
  }
};

// 🔹 Common validation
const validateCode = (code) => {
  if (!code || !code.trim()) {
    throw new Error("Code cannot be empty");
  }
};

// 🔹 Translate Code
const translateCode = (code, sourceLanguage, targetLanguage) => {
  validateCode(code);

  return handleRequest(
    API.post("/code/translate", {
      code,
      sourceLanguage,
      targetLanguage,
    }),
    "Translate"
  );
};

// 🔹 Analyze Complexity
const analyzeComplexity = (code, language) => {
  validateCode(code);

  return handleRequest(
    API.post("/code/analyze", { code, language }),
    "Analyze"
  );
};

// 🔹 Optimize Code
const optimizeCode = (code, language) => {
  validateCode(code);

  return handleRequest(
    API.post("/code/optimize", { code, language }),
    "Optimize"
  );
};

// 🔹 Explain Code
const explainCode = (code, language) => {
  validateCode(code);

  return handleRequest(
    API.post("/code/explain", { code, language }),
    "Explain"
  );
};

export {
  translateCode,
  analyzeComplexity,
  optimizeCode,
  explainCode,
};
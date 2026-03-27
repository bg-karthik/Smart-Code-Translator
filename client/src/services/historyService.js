import API from "./api.js";

// 🔹 Shared handler
const handleRequest = async (promise, label) => {
  try {
    const response = await promise;
    return response?.data?.data ?? response?.data ?? null;
  } catch (error) {
    console.error(`${label} Error:`, error);

    const message =
      error.response?.data?.message ||
      `${label} request failed`;

    throw new Error(message);
  }
};

// 🔹 Validate ID
const validateId = (id) => {
  if (!id) throw new Error("Invalid history ID");
};

// 🔹 Get paginated history
const getHistory = (page = 1, limit = 10) => {
  return handleRequest(
    API.get(`/history?page=${page}&limit=${limit}`),
    "Get History"
  );
};

// 🔹 Get single history item
const getHistoryItem = (id) => {
  validateId(id);

  return handleRequest(
    API.get(`/history/${id}`),
    "Get History Item"
  );
};

// 🔹 Delete one entry
const deleteHistoryItem = (id) => {
  validateId(id);

  return handleRequest(
    API.delete(`/history/${id}`),
    "Delete History"
  );
};

// 🔹 Clear all history
const clearHistory = () => {
  return handleRequest(
    API.delete("/history/clear"),
    "Clear History"
  );
};

export {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
  clearHistory,
};
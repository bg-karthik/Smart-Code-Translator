import History from "../models/History.model.js";

export const createHistoryEntry = async (data) => {
  const entry = await History.create(data);
  return entry;
};

export const getUserHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [entries, totalEntries] = await Promise.all([
    History.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    History.countDocuments({ userId }),
  ]);

  return {
    entries,
    totalEntries,
    totalPages: Math.ceil(totalEntries / limit),
    currentPage: page,
  };
};

export const getHistoryEntryById = async (id, userId) => {
  const entry = await History.findOne({ _id: id, userId });
  return entry;
};

export const deleteHistoryEntry = async (id, userId) => {
  const entry = await History.findOneAndDelete({ _id: id, userId });
  return entry;
};

export const clearUserHistory = async (userId) => {
  const result = await History.deleteMany({ userId });
  return result;
};
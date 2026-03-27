import * as historyService from "../services/history.service.js";

export const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await historyService.getUserHistory(req.user._id, page, limit);
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getHistoryItem = async (req, res, next) => {
  try {
    const entry = await historyService.getHistoryEntryById(req.params.id, req.user._id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "History entry not found." });
    }
    return res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

export const deleteHistoryItem = async (req, res, next) => {
  try {
    const entry = await historyService.deleteHistoryEntry(req.params.id, req.user._id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "History entry not found." });
    }
    return res.json({ success: true, data: { message: "Entry deleted successfully." } });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await historyService.clearUserHistory(req.user._id);
    return res.json({ success: true, data: { message: "History cleared successfully." } });
  } catch (error) {
    next(error);
  }
};
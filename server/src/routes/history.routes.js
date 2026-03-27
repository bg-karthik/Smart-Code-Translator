import { Router } from "express";
import {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
  clearHistory,
} from "../controllers/history.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// /clear must come before /:id so Express doesn't treat "clear" as an id
router.delete("/clear", clearHistory);

router.get("/", getHistory);
router.get("/:id", getHistoryItem);
router.delete("/:id", deleteHistoryItem);

export default router;
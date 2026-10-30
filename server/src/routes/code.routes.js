import { Router } from "express";
import { translate, analyze, optimize, explain } from "../controllers/code.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import { aiRateLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

router.use(authenticate);
router.use(aiRateLimiter);

router.post("/translate", translate);
router.post("/analyze", analyze);
router.post("/optimize", optimize);
router.post("/explain", explain);

export default router;

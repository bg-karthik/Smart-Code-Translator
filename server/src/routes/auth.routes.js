import { Router } from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.middleware.js";

const router = Router();

// Public routes (rate-limited to prevent brute-force attacks)
router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.post("/google", authRateLimiter, googleAuth);

// Protected routes (auth required)
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

export default router;

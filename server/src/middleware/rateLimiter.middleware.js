import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Consistent 429 error handler
export const createRateLimitHandler = (message) => (req, res) => {
  res.status(429).json({
    success: false,
    message,
  });
};

/**
 * Limit resolvers:
 * Security guarantee: x-test-rate-limit is ONLY evaluated when process.env.NODE_ENV === "test".
 * In production or development, limits are strictly static (20 for auth, 30 for AI),
 * ensuring external callers cannot alter rate-limiting thresholds via custom request headers.
 */
export const resolveAuthLimit = (req) => {
  if (process.env.NODE_ENV === "test" && req.headers?.["x-test-rate-limit"]) {
    return 2;
  }
  return 20;
};

export const resolveAiLimit = (req) => {
  if (process.env.NODE_ENV === "test" && req.headers?.["x-test-rate-limit"]) {
    return 2;
  }
  return 30;
};

export const shouldSkipRateLimit = (req) => {
  // In test environment, skip unless x-test-rate-limit header is explicitly provided
  if (process.env.NODE_ENV === "test" && !req.headers?.["x-test-rate-limit"]) {
    return true;
  }
  return false;
};

/**
 * Authentication Rate Limiter
 * Applied to: /api/auth/login, /api/auth/register, /api/auth/google
 * Limit: 20 requests per 15 minutes per IP
 * IPv6 addresses are automatically masked to /56 subnet via built-in ipKeyGenerator
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: resolveAuthLimit,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler("Too many authentication attempts. Please try again after 15 minutes."),
  skip: shouldSkipRateLimit,
});

/**
 * AI Code Operations Rate Limiter
 * Applied to: /api/code/translate, /api/code/analyze, /api/code/optimize, /api/code/explain
 * Limit: 30 requests per minute
 * Key: Authenticated User ID (if present) to prevent NAT/shared IP collisions; falls back to subnet-masked IP
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: resolveAiLimit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?._id) {
      return req.user._id.toString();
    }
    return ipKeyGenerator(req.ip);
  },
  handler: createRateLimitHandler("AI request rate limit exceeded. Please wait a moment before trying again."),
  skip: shouldSkipRateLimit,
});

export default {
  authRateLimiter,
  aiRateLimiter,
  resolveAuthLimit,
  resolveAiLimit,
  shouldSkipRateLimit,
  createRateLimitHandler,
};

/**
 * CORS Configuration for Smart Code Translator
 * 
 * Supports:
 * - Dynamic CLIENT_URL from Render (single or comma-separated)
 * - Known production frontend deployments (Vercel)
 * - Development localhost origins on ports 5173, 5174, 3000
 * - Handles preflight OPTIONS, methods, headers, and credential policies securely.
 */

const getNormalizedOrigins = () => {
  const allowed = new Set();

  // 1. Environment variable CLIENT_URL (supports comma-separated list)
  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(",")
      .map((url) => url.trim().replace(/\/+$/, ""))
      .filter(Boolean)
      .forEach((url) => allowed.add(url));
  }

  // 2. Production Vercel domains
  allowed.add("https://smartcodetranslator.vercel.app");
  allowed.add("https://smart-code-translator.vercel.app");

  return allowed;
};

// Localhost regex for local development
const LOCALHOST_REGEX = /^http:\/\/(localhost|127\.0\.0\.1):(5173|5174|3000)$/;

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (curl, Postman, health checks, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/+$/, "");
    const allowedOrigins = getNormalizedOrigins();

    // Check production allowed origins
    if (allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true);
    }

    // Check development localhost origins
    if (LOCALHOST_REGEX.test(normalizedOrigin)) {
      return callback(null, true);
    }

    // Explicitly reject unauthorized origins (no wildcard fallback)
    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 204,
  maxAge: 86400, // Cache preflight for 24 hours
};

export default corsOptions;


import express from "express";
import cors from "cors";
import corsOptions from "./config/cors.config.js";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

// Trust reverse proxy (Render / Cloudflare) to accurately capture client IP from X-Forwarded-For
app.set("trust proxy", 1);

// Secure CORS middleware
app.use(cors(corsOptions));

// Parse JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔹 API routes
app.use("/api", routes);

// 🔹 Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

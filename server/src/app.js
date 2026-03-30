import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

// Allow frontend
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

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
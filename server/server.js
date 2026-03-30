import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.config.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    // 🔹 Validate env
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    // 🔹 Connect DB
    await connectDB();
    console.log("✅ Database connected successfully");

    // 🔹 Start server
    const server = app.listen(PORT, () => {
      console.log(`🌐 Server running on port ${PORT}`);
    });

    // 🔥 Handle server errors
    server.on("error", (err) => {
      console.error("❌ Server error:", err);
      process.exit(1);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// 🔥 Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

// 🔥 Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

startServer();
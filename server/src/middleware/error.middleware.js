export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  // Handle CORS errors specifically
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "CORS error: Request origin not allowed.",
    });
  }

  const status = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  
  if (process.env.NODE_ENV !== "production") {
    console.error(`[Error ${status}]:`, err.message);
  }

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error.",
  });
};

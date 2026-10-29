import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in your .env file");
    }

    // Automatically enforce test database isolation when running in test mode
    if (process.env.NODE_ENV === "test") {
      mongoURI = mongoURI.replace(/\/code-translator(\?|$)/, "/code-translator-test$1");
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      required: [true, "Operation type is required"],
      enum: ["translate", "analyze", "optimize", "explain"],
    },
    inputCode: {
      type: String,
      required: [true, "Input code is required"],
    },
    sourceLanguage: {
      type: String,
      required: [true, "Source language is required"],
    },
    targetLanguage: {
      type: String,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Output is required"],
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", historySchema);
export default History;
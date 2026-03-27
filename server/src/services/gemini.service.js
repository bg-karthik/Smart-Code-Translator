import { safeGenerateContent as generateContent } from "../config/gemini.config.js";

export const askGemini = async (prompt) => {
  try {
    const response = await generateContent(prompt);

    if (!response) {
      throw new Error("Empty response from Gemini");
    }

    return response;
  } catch (error) {
    console.error("Gemini Service Error:", error.message);
    throw error;
  }
};
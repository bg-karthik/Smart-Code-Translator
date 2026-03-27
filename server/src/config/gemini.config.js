import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

// 🔹 Read API key
const apiKey = process.env.GEMINI_API_KEY;

// 🔹 Safe init
let ai = null;

if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key") {
  console.warn("⚠ Gemini AI is disabled (no valid API key)");
} else {
  console.log("✅ Gemini initialized");
  ai = new GoogleGenAI({ apiKey });
}

const MODEL_NAME = "gemini-2.5-flash";

// 🔹 Sleep helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔹 Main generator
const generateContent = async (prompt, retries = 2) => {
  if (!ai) {
    throw new Error("Gemini API not configured");
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini");
    }

    return response.text;
  } catch (error) {
    // 🔁 Retry if quota exceeded
    if (error?.status === 429 && retries > 0) {
      console.warn(`⏳ Retry Gemini... (${retries})`);
      await sleep(2000);
      return generateContent(prompt, retries - 1);
    }

    console.error("❌ Gemini FULL error:", error);
    throw new Error("Failed to get response from Gemini AI");
  }
};

// 🔹 Safe wrapper (prevents crash)
export const safeGenerateContent = async (prompt) => {
  try {
    return await generateContent(prompt);
  } catch (error) {
    console.warn("⚠ Gemini fallback activated");

    return JSON.stringify({
      translatedCode: "// ⚠ Gemini unavailable. Try again later.",
      explanation: "Gemini AI is currently unavailable.",
      optimizedCode: "// Unable to optimize due to API limit.",
      suggestions: "API limit reached. Retry later.",
      timeComplexity: "N/A",
      spaceComplexity: "N/A",
    });
  }
};

// 🔹 Export main
export { generateContent };
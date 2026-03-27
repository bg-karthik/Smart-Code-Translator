export const parseGeminiJSON = (text) => {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid Gemini response");
    }

    let cleanText = text.trim();

    // Remove markdown code block if present
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, "");
      cleanText = cleanText.replace(/\n?```$/, "");
    }

    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("Parse Error:", error.message);
    throw new Error(
      "Failed to parse Gemini response as JSON: " + error.message
    );
  }
};

export const cleanCodeResponse = (text) => {
  if (!text || typeof text !== "string") {
    return "";
  }

  let cleanText = text.trim();

  // Remove markdown code block if present
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```\w*\s*\n?/, "");
    cleanText = cleanText.replace(/\n?```$/, "");
    cleanText = cleanText.trim();
  }

  return cleanText;
};
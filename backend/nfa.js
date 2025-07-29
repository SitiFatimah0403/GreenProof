require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini-powered NFA (optional, async)
async function getGeminiResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "⚠️ Gemini failed to respond. Try again later.";
  }
}

// Simulated NFA agent for eco suggestions
function getNFAResponse(userAction) {
  if (!userAction) return "Please describe your eco-friendly activity.";

  const lower = userAction.toLowerCase();

  if (lower.includes("plant") || lower.includes("tree")) {
    return "🌱 Great job planting trees! Trees help reduce CO₂ and restore biodiversity. Consider joining a reforestation community.";
  }

  if (lower.includes("bike") || lower.includes("cycle")) {
    return "🚴‍♀️ Switching to a bicycle is an awesome move! It cuts emissions and improves your health. Keep pedaling!";
  }

  if (lower.includes("recycle") || lower.includes("trash")) {
    return "♻️ Recycling helps reduce landfill waste. Try sorting your plastic, paper, and organic waste separately!";
  }

  return "✅ Thank you for taking climate action! Keep it up. 🌍 Want more tips? Try reducing electricity use or switching to reusable items.";
}

module.exports = { getNFAResponse, getGeminiResponse };

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runNFA() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    
    const result = await model.generateContent("Suggest 3 skills based on someone who likes data and sustainability.");

    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
  }
}

runNFA();
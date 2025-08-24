const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json()); // ✅ use built-in express JSON parser

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route for chatbot
app.post("/ai/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ use the correct Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // you can also use "gemini-1.5-pro" if you want more powerful responses

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    res.json({
      prompt: prompt,
      output: aiResponse,
    });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Jerry AI backend running on port ${PORT}`)
);

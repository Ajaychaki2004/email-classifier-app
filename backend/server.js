import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { classifyEmails } from "./utils/classify.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// --- Health check route
app.get("/", (req, res) => {
  res.send("AI Email Classifier Backend is running 🚀");
});

// --- Classification route
app.post("/classify", async (req, res) => {
  try {
    const { emails, openaiKey } = req.body;
    if (!emails || !openaiKey) {
      return res.status(400).json({ error: "Missing emails or OpenAI API key" });
    }

    const results = await classifyEmails(emails, openaiKey);
    res.json({ classified: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Classification failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

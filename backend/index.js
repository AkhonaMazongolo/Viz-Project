import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AzureOpenAI } from "openai";
import { loginUser, registerUser } from "./auth.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

app.post("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    const message = error.message || "Failed to register user";
    res.status(400).json({ error: message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    const message = error.message || "Failed to login";
    res.status(401).json({ error: message });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const start = Date.now();

    const response = await client.responses.create({
      model: process.env.MODEL,
      input: message,
    });

    const duration = Date.now() - start;
    console.log(`AI response time: ${duration}ms`);

    res.json({ reply: response.output_text });
  } catch (error) {  
    console.error(error);

    res.status(500).json({
      error: "Failed to get response",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// health check
app.get("/health", (req, res) => res.json({ status: "ok" }));


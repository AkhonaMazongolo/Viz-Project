import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AzureOpenAI } from "openai";
import multer from "multer";
import { loginUser, registerUser } from "./auth.js";
import {
  getConversationHistory,
  getOrCreateConversation,
  saveMessage,
} from "./chatService.js";
import { storeDocument } from "./documentService.js";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

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

app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file || !userId) {
      return res.status(400).json({ error: "Document and user ID are required" });
    }

    const storedDocument = await storeDocument(userId, {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
      text: req.file.buffer.toString("utf8"),
    });

    res.json({
      message: "Document uploaded successfully",
      document: storedDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { message, userId, documentContext } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const conversation = await getOrCreateConversation(Number(userId));
    await saveMessage(conversation.id, "user", message);

    const history = await getConversationHistory(conversation.id);
    const start = Date.now();

    const prompt = documentContext
      ? `Use the following extracted document context to answer the user question.\n\nDocument context:\n${documentContext}`
      : "Answer the user question normally.";

    const response = await client.responses.create({
      model: process.env.MODEL,
      input: [
        ...history,
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
    });

    await saveMessage(conversation.id, "assistant", response.output_text);

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


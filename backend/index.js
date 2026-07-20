import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AzureOpenAI } from "openai";
// import { PrismaClient } from "@prisma/client";
// import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

dotenv.config();

const app = express();
// const adapter = new PrismaBetterSQLite3({
//   url: process.env.DATABASE_URL || "file:./dev.db",
// });
// const prisma = new PrismaClient({ adapter });

// Configure CORS and JSON parsing before routes
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

// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "Name, email, and password are required" });
//     }

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         passwordHash: password,
//       },
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to register user" });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user || user.passwordHash !== password) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to login" });
//   }
// });

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


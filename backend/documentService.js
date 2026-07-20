import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function ensureUploadDir() {
  await fs.mkdir(uploadDir, { recursive: true });
}

function extractStructuredData(text) {
  const summary = text.replace(/\s+/g, " ").trim();

  return {
    documentType: "generic",
    extractedText: summary.slice(0, 4000),
    extractedFields: [
      {
        label: "Summary",
        value: summary.slice(0, 1000),
      },
    ],
  };
}

export async function storeDocument(userId, file) {
  await ensureUploadDir();

  const fileName = `${Date.now()}-${file.originalname || "document"}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, file.buffer);

  const extractedData = extractStructuredData(file.text || "");

  const document = await prisma.document.create({
    data: {
      userId: Number(userId),
      fileName,
      originalName: file.originalname || "document",
      filePath,
      documentType: extractedData.documentType,
      extractedText: extractedData.extractedText,
      extractedFields: JSON.stringify(extractedData.extractedFields),
    },
  });

  return {
    id: document.id,
    fileName: document.fileName,
    filePath: document.filePath,
    extractedData,
  };
}

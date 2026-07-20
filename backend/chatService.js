import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client.ts";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

export async function getOrCreateConversation(userId) {
  let conversation = await prisma.conversation.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId },
    });
  }

  return conversation;
}

export async function saveMessage(conversationId, role, content) {
  await prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}

export async function getConversationHistory(conversationId) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });

  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

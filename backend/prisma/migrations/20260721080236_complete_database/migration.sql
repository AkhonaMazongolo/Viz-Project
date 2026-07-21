/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `extractedFields` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `extractedText` on the `Document` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentID` to the `GLDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrialBalance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountNumber" TEXT,
    "accountType" TEXT,
    "branch" INTEGER,
    "dept" TEXT,
    "debits" REAL,
    "credits" REAL,
    "PYDebits" REAL,
    "PYCredits" REAL,
    "documentID" INTEGER NOT NULL,
    CONSTRAINT "TrialBalance_documentID_fkey" FOREIGN KEY ("documentID") REFERENCES "Document" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Visualization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "chartType" TEXT NOT NULL,
    "prompt" TEXT,
    "config" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Visualization_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metricValue" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Insight_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocumentChunk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documentId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "embeddingId" TEXT,
    "pageNumber" INTEGER,
    CONSTRAINT "DocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conversation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conversation" ("createdAt", "id", "title", "updatedAt", "userId") SELECT "createdAt", "id", "title", "updatedAt", "userId" FROM "Conversation";
DROP TABLE "Conversation";
ALTER TABLE "new_Conversation" RENAME TO "Conversation";
CREATE TABLE "new_Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Document_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("createdAt", "documentType", "fileName", "filePath", "id", "originalName", "updatedAt", "userId") SELECT "createdAt", "documentType", "fileName", "filePath", "id", "originalName", "updatedAt", "userId" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE TABLE "new_GLDocument" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountNumber" INTEGER,
    "reference" TEXT,
    "contactAccount" TEXT,
    "description" TEXT,
    "debit" REAL,
    "credit" REAL,
    "balance" REAL,
    "monthName" TEXT,
    "categoryName" TEXT,
    "rootName" TEXT,
    "subCategoryName" TEXT,
    "fsaName" TEXT,
    "subFsaName" TEXT,
    "material" INTEGER,
    "randMaterial" REAL,
    "amount" REAL,
    "departmentCode" TEXT,
    "dimensionSetID" INTEGER,
    "paypointCode" INTEGER,
    "genPostingType" TEXT,
    "genBusPostingGroup" TEXT,
    "balanceAccountType" TEXT,
    "balanceAccountNumber" INTEGER,
    "entryNo" INTEGER,
    "externalDocumentNo" TEXT,
    "accountName" TEXT,
    "jobTypeCode" INTEGER,
    "documentType" TEXT,
    "genProdOPostingGroup" TEXT,
    "letter" TEXT,
    "letterDate" DATETIME,
    "vendorTypeCode" TEXT,
    "itemCategoryCode" TEXT,
    "productTypeCode" TEXT,
    "expenseSplitCode" TEXT,
    "trialCode" TEXT,
    "resourseCode" TEXT,
    "userID" TEXT,
    "date" DATETIME,
    "glAccountName" TEXT,
    "vatAmount" REAL,
    "documentID" INTEGER NOT NULL,
    CONSTRAINT "GLDocument_documentID_fkey" FOREIGN KEY ("documentID") REFERENCES "Document" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GLDocument" ("accountName", "accountNumber", "amount", "balance", "balanceAccountNumber", "balanceAccountType", "categoryName", "contactAccount", "credit", "date", "debit", "departmentCode", "description", "dimensionSetID", "documentType", "entryNo", "expenseSplitCode", "externalDocumentNo", "fsaName", "genBusPostingGroup", "genPostingType", "genProdOPostingGroup", "glAccountName", "id", "itemCategoryCode", "jobTypeCode", "letter", "letterDate", "material", "monthName", "paypointCode", "productTypeCode", "randMaterial", "reference", "resourseCode", "rootName", "subCategoryName", "subFsaName", "trialCode", "userID", "vatAmount", "vendorTypeCode") SELECT "accountName", "accountNumber", "amount", "balance", "balanceAccountNumber", "balanceAccountType", "categoryName", "contactAccount", "credit", "date", "debit", "departmentCode", "description", "dimensionSetID", "documentType", "entryNo", "expenseSplitCode", "externalDocumentNo", "fsaName", "genBusPostingGroup", "genPostingType", "genProdOPostingGroup", "glAccountName", "id", "itemCategoryCode", "jobTypeCode", "letter", "letterDate", "material", "monthName", "paypointCode", "productTypeCode", "randMaterial", "reference", "resourseCode", "rootName", "subCategoryName", "subFsaName", "trialCode", "userID", "vatAmount", "vendorTypeCode" FROM "GLDocument";
DROP TABLE "GLDocument";
ALTER TABLE "new_GLDocument" RENAME TO "GLDocument";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

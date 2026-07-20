# Prisma Setup Guide for the Backend

This guide explains how to set up Prisma in the backend, create tables, update them, delete them, and view your database locally.

## 1. Prerequisites

Make sure you have the following installed:

- Node.js and npm
- A terminal such as PowerShell, CMD, or Git Bash

## 2. Install Prisma in the backend

Open a terminal in the backend folder:

```bash
cd backend
npm install
```

If Prisma is not already installed in your project, run:

```bash
npm install prisma @prisma/client dotenv --save-dev
```

## 3. Configure the database connection

This project is currently using SQLite for local development.

### Environment file

Create or update the .env file in the backend folder:

```env
DATABASE_URL="file:./dev.db"
```

### Prisma config file

The Prisma config file should look like this:

```ts
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

## 4. Define your Prisma schema

The schema file is located at:

```text
backend/prisma/schema.prisma
```

Example schema:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 5. Create a table

To create a table from your Prisma model:

```bash
npx prisma generate
npx prisma db push
```

These commands will:

- generate the Prisma client
- create the SQLite database file if it does not exist
- create the table based on your schema

## 6. Update an existing table

To update a table, edit the Prisma model in the schema file.

Example: add a new field to the User model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Then run:

```bash
npx prisma migrate dev --name add-user-role
```

This creates a migration file and applies the change to the database.

## 7. Delete a table

To delete a table, remove the model from the Prisma schema.

Example:

```prisma
// remove this model from schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Then run:

```bash
npx prisma migrate dev --name remove-user-model
```

This removes the table from the database.

## 8. View the database visually

Run Prisma Studio:

```bash
npx prisma studio
```

Then open:

```text
http://localhost:5555
```

If you are using Windows PowerShell and npx is blocked, use:

```bash
./node_modules/.bin/prisma.cmd studio --browser none
```

## 9. Useful Prisma commands

```bash
npx prisma generate
npx prisma db push
npx prisma migrate dev --name your_change_name
npx prisma studio
```

## 10. Troubleshooting

### Prisma cannot connect to the database

Make sure your database URL is correct in the .env file.

For SQLite it should be:

```env
DATABASE_URL="file:./dev.db"
```

### Prisma Studio does not start

Try running it with the local binary:

```bash
./node_modules/.bin/prisma.cmd studio --browser none
```

### PowerShell blocks npx

If you see a script execution policy error, run the command from CMD instead, or use the local Prisma binary as shown above.

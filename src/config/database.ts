import { config } from "./config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: config.nodeEnv === "development" ? ["info", "query", "warn"] : ["error"],
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("prisma database is connected successfully");
  } catch (error) {
    console.log("prisma connection error");
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log("prisma database is disconnected");
  } catch (err) {
    console.log("prisma disconnection errror");
  }
}

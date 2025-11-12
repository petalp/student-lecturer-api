import { PrismaClient } from "../generated/prisma/client";
import { config } from "./config";

export const prisma = new PrismaClient({
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

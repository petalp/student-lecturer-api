import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: path.join("db", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

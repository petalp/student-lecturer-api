import dotenv from "dotenv";
import { IConfig } from "./types";

dotenv.config();

export const config: IConfig = {
  PORT: parseInt(process.env.PORT as string) || 5050,
  nodeEnv: process.env.NODE_ENV || " ",
  DATABASE_URL: process.env.DATABASE_URL || "",
  Jwt: {
    jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || "",
    jwtRefreshSecret: process.env.JTW_REFRESH_TOKEN_SECRET || "",
    jwtAccessExpiresAt: process.env.JWT_ACCESS_TOKEN_EXPIRES_AT || "",
    jwtRefreshExpiresAt: process.env.JWT_REFRESH_TOKEN_EXPIRES_AT || "",
  },
};

import dotenv from "dotenv";

dotenv.config();

interface IConfig {
  PORT: number;
  nodeEnv: string;
  DATABASE_URL: string;
}

export const config: IConfig = {
  PORT: parseInt(process.env.PORT as string) || 5050,
  nodeEnv: process.env.NODE_ENV || " ",
  DATABASE_URL: process.env.DATABASE_URL || "",
};

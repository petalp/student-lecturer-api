"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: parseInt(process.env.PORT) || 5050,
    nodeEnv: process.env.NODE_ENV || " ",
    DATABASE_URL: process.env.DATABASE_URL || "",
    Jwt: {
        jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || "",
        jwtRefreshSecret: process.env.JTW_REFRESH_TOKEN_SECRET || "",
        jwtAccessExpiresAt: process.env.JWT_ACCESS_TOKEN_EXPIRES_AT || "",
        jwtRefreshExpiresAt: process.env.JWT_REFRESH_TOKEN_EXPIRES_AT || "",
    },
};

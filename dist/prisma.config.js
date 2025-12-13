"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
const path_1 = __importDefault(require("path"));
exports.default = (0, config_1.defineConfig)({
    schema: path_1.default.join("./prisma"),
    migrations: {
        path: path_1.default.join("prisma", "migrations"),
    },
    datasource: {
        url: (0, config_1.env)("DATABASE_URL"),
    },
});

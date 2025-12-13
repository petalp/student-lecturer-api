"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("@/config/config");
const index_route_1 = __importDefault(require("@/base_route/index.route"));
const server = (0, express_1.default)();
server.use(express_1.default.json());
//health check
server.use(index_route_1.default);
// server.use(errorHandlingMiddleware);
server.listen(config_1.config.PORT, "192.168.1.231", async () => {
    console.log(`server is running on http://localhost:${config_1.config.PORT}`);
});

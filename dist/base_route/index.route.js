"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_routes_1 = __importDefault(require("../students/routes/student.routes"));
const auth_route_1 = __importDefault(require("../Auth/AuthRoute/auth.route"));
const baseRoute = express_1.default.Router();
baseRoute.use("/api/v1/students", student_routes_1.default);
baseRoute.use("/api/v1/auth", auth_route_1.default);
exports.default = baseRoute;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../AuthController/auth.controller"));
const authController = new auth_controller_1.default();
const authRoute = express_1.default.Router();
/**
 * @route POST /
 * @desc create admin
 * @access public
 */
authRoute.post("/", authController.createAdmin);
/**
 * @route POST /login
 * @desc login users
 * @access public
 *
 */
authRoute.post("/login", authController.login);
exports.default = authRoute;

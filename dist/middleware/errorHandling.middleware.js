"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlingMiddleware = errorHandlingMiddleware;
const CustomError_1 = __importDefault(require("../error/CustomError"));
function errorHandlingMiddleware(error, req, res, next) {
    if (error instanceof CustomError_1.default) {
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
        });
        return;
    }
    return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
    });
}

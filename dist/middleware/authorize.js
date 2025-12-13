"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = require("../error/CustomError");
async function authorize(req, res, next) {
    if (req.user?.role !== "ADMIN") {
        throw new CustomError_1.AuthorizationError({
            message: "you're not authorize",
            statusCode: 401,
        });
    }
    next();
}
exports.default = authorize;

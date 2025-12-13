"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = require("@/error/CustomError");
class JWTUtils {
    static ISSUSER = "app-owner";
    static AUDIENCE = "audience-app";
    static generateGeneralToken(payload, secretKey, expiresIn) {
        const options = {
            issuer: this.ISSUSER,
            audience: this.AUDIENCE,
            expiresIn: expiresIn,
        };
        const token = jsonwebtoken_1.default.sign(payload, secretKey, options);
        return token;
    }
    static generateAccessToken(payload, secretKey, expiresIn) {
        return this.generateGeneralToken(payload, secretKey, expiresIn);
    }
    static generateRefreshToken(payload, secretKey, expiresIn) {
        return this.generateGeneralToken(payload, secretKey, expiresIn);
    }
    static verifyAccessToken(token, secretKey) {
        return this.verifyToken(token, secretKey);
    }
    static verifyRefreshToken(token, secretKey) {
        return this.verifyToken(token, secretKey);
    }
    static verifyToken(token, secretKey) {
        try {
            const options = {
                issuer: this.ISSUSER,
                audience: this.AUDIENCE,
            };
            const decoded = jsonwebtoken_1.default.verify(token, secretKey, options);
            return {
                user_id: decoded.user_id,
                username: decoded.username,
                role: decoded.role,
                email: decoded.email,
            };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new CustomError_1.AuthenticationError({
                    message: "token invalid",
                    statusCode: 401,
                });
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new CustomError_1.AuthenticationError({
                    message: "token has expired",
                    statusCode: 401,
                });
            }
            throw new CustomError_1.AuthenticationError({
                message: "token verification failed",
                statusCode: 400,
            });
        }
    }
}
exports.default = JWTUtils;

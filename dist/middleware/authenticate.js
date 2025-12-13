"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = require("../error/CustomError");
const jwtUtils_1 = __importDefault(require("../utils/jwtUtils"));
const config_1 = require("../config/config");
const database_1 = require("../config/database");
async function authenticate(req, res, next) {
    //get the authorization from the request header
    const authorization = req.headers.authorization;
    //check if authorization header is empty
    if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new CustomError_1.AuthenticationError({
            message: "authorization header available",
            statusCode: 400,
        });
    }
    //get the token from the authorize header
    const token = authorization.split(" ")[1];
    //verify token
    const decoded = jwtUtils_1.default.verifyAccessToken(token, config_1.config.Jwt.jwtAccessSecret);
    //get the user info from the database
    console.log(decoded);
    const user = await database_1.prisma.user.findUnique({
        where: { email: decoded.email },
        select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
        },
    });
    if (user)
        req.user = user;
    next();
    //add the user info to the reques
}
exports.default = authenticate;

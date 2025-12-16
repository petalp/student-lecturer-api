import jwt from "jsonwebtoken";
import { AuthenticationError } from "../error/CustomError.js";
class JWTUtils {
    static ISSUSER = "app-owner";
    static AUDIENCE = "audience-app";
    static generateGeneralToken(payload, secretKey, expiresIn) {
        const options = {
            issuer: this.ISSUSER,
            audience: this.AUDIENCE,
            expiresIn: expiresIn,
        };
        const token = jwt.sign(payload, secretKey, options);
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
            const decoded = jwt.verify(token, secretKey, options);
            return {
                user_id: decoded.user_id,
                username: decoded.username,
                role: decoded.role,
                email: decoded.email,
            };
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthenticationError({
                    message: "token invalid",
                    statusCode: 401,
                });
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthenticationError({
                    message: "token has expired",
                    statusCode: 401,
                });
            }
            throw new AuthenticationError({
                message: "token verification failed",
                statusCode: 400,
            });
        }
    }
}
export default JWTUtils;

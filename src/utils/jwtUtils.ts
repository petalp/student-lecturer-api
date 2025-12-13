import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { TokenPayload } from "@utils/token";
import { AuthenticationError } from "@/error/CustomError";

class JWTUtils {
  private static readonly ISSUSER = "app-owner";
  private static readonly AUDIENCE = "audience-app";

  private static generateGeneralToken(
    payload: TokenPayload,
    secretKey: string,
    expiresIn: string
  ): string {
    const options: SignOptions = {
      issuer: this.ISSUSER,
      audience: this.AUDIENCE,
      expiresIn: expiresIn as any,
    };
    const token = jwt.sign(payload, secretKey, options);
    return token;
  }

  public static generateAccessToken(
    payload: TokenPayload,
    secretKey: string,
    expiresIn: string
  ): string {
    return this.generateGeneralToken(payload, secretKey, expiresIn);
  }

  public static generateRefreshToken(
    payload: TokenPayload,
    secretKey: string,
    expiresIn: string
  ) {
    return this.generateGeneralToken(payload, secretKey, expiresIn);
  }

  public static verifyAccessToken(token: string, secretKey: string) {
    return this.verifyToken(token, secretKey);
  }

  public static verifyRefreshToken(token: string, secretKey: string) {
    return this.verifyToken(token, secretKey);
  }

  private static verifyToken(token: string, secretKey: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        issuer: this.ISSUSER,
        audience: this.AUDIENCE,
      };
      const decoded = jwt.verify(token, secretKey, options) as JwtPayload;
      return {
        user_id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
        email: decoded.email,
      };
    } catch (error) {
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

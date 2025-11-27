import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../error/CustomError";
import JWTUtils from "../utils/jwtUtils";
import { config } from "../config/config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/database";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  //get the authorization from the request header
  const authorization = req.headers.authorization;

  //check if authorization header is empty
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthenticationError({
      message: "authorization header available",
      statusCode: 400,
    });
  }
  //get the token from the authorize header
  const token = authorization.split(" ")[1];
  //verify token
  const decoded = JWTUtils.verifyAccessToken(
    token,
    config.Jwt.jwtAccessSecret
  ) as JwtPayload;
  //get the user info from the database
  console.log(decoded);
  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
    select: {
      user_id: true,
      username: true,
      email: true,
      role: true,
    },
  });
  if (user) req.user = user;

  next();
  //add the user info to the reques
}

export default authenticate;

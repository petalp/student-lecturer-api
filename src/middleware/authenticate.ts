import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../error/CustomError";

function authenticate(req: Request, res: Response, next: NextFunction) {
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
  //get the user info from the database
  //add the user info to the reques
}

import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../error/CustomError";

async function authorize(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    throw new AuthorizationError({
      message: "you're not authorize",
      statusCode: 401,
    });
  }

  next();
}

export default authorize;

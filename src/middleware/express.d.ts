import "express";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: number;
        email: string;
        username: string;
        role: Role;
      };
    }
  }
}

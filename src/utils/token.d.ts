import { Role } from "@prisma/client";

interface TokenPayload {
  user_id: number;
  username: string;
  email: string;
  role: Role;
}

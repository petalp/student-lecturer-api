import { Role } from "../generated/prisma/enums";

interface TokenPayload {
  user_id: number;
  username: string;
  role: Role;
}

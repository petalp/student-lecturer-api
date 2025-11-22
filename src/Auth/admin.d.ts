import { Role } from "../generated/prisma/enums";

interface ICreateAdmin {
  firstName: string;
  middleName: string | null;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  sex: string;
}

interface IAdminResponse {
  user_id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  username: string;
  email: string;
  role: Role;
  sex: string;
  createAt: Date;
  updateAt: Date;
}

import { Role } from "@prisma/client";

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

interface IToken {
  refreshToken: string;
  accessToken: string;
}

interface ILoginRespone<T> {
  user: T | null;
  token: IToken;
}

interface ILogin {
  email: string;
  password: string;
}

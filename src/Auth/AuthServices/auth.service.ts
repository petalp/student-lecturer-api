import { prisma } from "../../config/database";
import { EntityExistError } from "../../error/CustomError";
import PasswordUtils from "../../utils/passwordUtils";
import { IAdminResponse, ICreateAdmin } from "../admin";

class AuthService {
  async createAdmin(admin: ICreateAdmin): Promise<IAdminResponse> {
    const checkAdminExist = await prisma.user.findUnique({
      where: { email: admin.email },
    });
    if (checkAdminExist) {
      throw new EntityExistError({
        message: "admin already exist",
        statusCode: 400,
      });
    }
    const hashedPassword = await PasswordUtils.hashPassword(admin.password);
    const registerAdmin = await prisma.user.create({
      data: {
        firstName: admin.firstName,
        middleName: admin.middleName,
        lastName: admin.lastName,
        email: admin.email,
        username: admin.username,
        password: hashedPassword,
        role: admin.role,
        sex: admin.sex,
      },
    });

    return registerAdmin;
  }
}

export default AuthService;

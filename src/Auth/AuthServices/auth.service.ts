import { config } from "../../config/config";
import { prisma } from "../../config/database";
import {
  AuthenticationError,
  EntityExistError,
  EntityNotFound,
} from "../../error/CustomError";
import JWTUtils from "../../utils/jwtUtils";
import PasswordUtils from "../../utils/passwordUtils";
import { TokenPayload } from "../../utils/token";
import { IAdminResponse, ICreateAdmin, ILogin, ILoginRespone } from "../admin";

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

  async login(
    loginInput: ILogin,
    ipAddress: string
  ): Promise<ILoginRespone<IAdminResponse>> {
    let user = await prisma.user.findUnique({
      where: { email: loginInput.email },
    });
    if (!user) {
      throw new EntityNotFound({ message: "user not found", statusCode: 404 });
    }
    const passwordValid = await PasswordUtils.verifyPassword(
      loginInput.password,
      user.password
    );
    if (!passwordValid) {
      throw new AuthenticationError({
        message: "password is incorrect",
        statusCode: 400,
      });
    }

    //check for user
    if (user.role === "ADMIN") {
      return { user, token: { refreshToken: "", accessToken: "" } };
    } else if (user.role === "STUDENT") {
      user = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          student: true,
        },
      });
    } else if (user.role === "LECTURER") {
      user = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          lecturer: true,
        },
      });
    }

    const tokens = await this.generateToken(user, ipAddress);
    return { user, token: { ...tokens } };
  }

  private async generateToken(
    user: any,
    address: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    };
    const accessToken = JWTUtils.generateAccessToken(
      payload,
      config.Jwt.jwtAccessSecret,
      config.Jwt.jwtAccessExpiresAt
    );
    const refreshToken = JWTUtils.generateRefreshToken(
      payload,
      config.Jwt.jwtRefreshSecret,
      config.Jwt.jwtRefreshExpiresAt
    );

    await prisma.tokens.create({
      data: {
        token: refreshToken,
        userId: user.user_id,
        ipAddress: address,
        location: "freetown",
      },
    });

    return { accessToken, refreshToken };
  }
}

export default AuthService;

import z from "zod";
import { config } from "@/config/config.js";
import { prisma } from "@/config/database.js";
import {
  AuthenticationError,
  EntityExistError,
  EntityNotFound,
} from "@/error/CustomError.js";
import JWTUtils from "@/utils/jwtUtils.js";
import PasswordUtils from "@/utils/passwordUtils.js";
import { TokenPayload } from "@/utils/token.js";
import { IAdminResponse, ILogin, ILoginRespone } from "../admin.js";
import { IAdmin, IuserProfile } from "@/utils/validations.js";

class AuthService {
  async createAdmin(admin: IAdmin, profile: IuserProfile): Promise<any> {
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
    const result = await prisma.$transaction(async (tsx: any) => {
      const registerAdmin = await tsx.user.create({
        data: {
          firstName: admin.firstName,
          middleName: admin.middleName,
          lastName: admin.lastName,
          email: admin.email,
          username: admin.username,
          password: hashedPassword,
          role: admin.role,
          sex: admin.sex,
          isActive: admin.isActive,
        },
      });
      const createProfile = await tsx.userProfile.create({
        data: {
          userId: registerAdmin.user_id,
          address: profile.address,
          city: profile.city,
          country: profile.coutry,
          phoneNumber: profile.phoneNumber,
          dateOfBirth: new Date(profile.dateOfBirth),
        },
      });
      return { registerAdmin, createProfile };
    });
    // const registerAdmin = await prisma.user.create({
    //   data: {
    //     firstName: admin.firstName,
    //     middleName: admin.middleName,
    //     lastName: admin.lastName,
    //     email: admin.email,
    //     username: admin.username,
    //     password: hashedPassword,
    //     role: admin.role,
    //     sex: admin.sex,
    //     isActive: admin.isActive,
    //   },
    // });

    return result;
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
      user = user;
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
      email: user.email,
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
    console.log("-------------------------------------------------");
    console.log(refreshToken, ":", refreshToken.length);
    console.log("-------------------------------------------------");
    console.log(accessToken, ":", accessToken.length);
    console.log("-------------------------------------------------");
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

import { randomInt } from "crypto";
import { config } from "@/config/config.js";
import { prisma } from "@/config/database.js";
import {
  AuthenticationError,
  EntityExistError,
  EntityNotFound,
} from "@/error/CustomError.js";
import { sendMail } from "@/config/nodemailer.js";
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

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new EntityNotFound({ message: "user not found", statusCode: 404 });
    }

    // Invalidate any existing unused reset tokens
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.user_id, used: false },
      data: { used: true },
    });

    // Generate a 6-digit OTP
    const otp = randomInt(100000, 999999).toString();
    const hashedOtp = await PasswordUtils.hashPassword(otp);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.passwordResetToken.create({
      data: {
        userId: user.user_id,
        token: hashedOtp,
        expiresAt,
      },
    });

    const html = `
      <p>Hello ${user.firstName},</p>
      <p>Your password reset OTP is: <strong>${otp}</strong></p>
      <p>This OTP expires in <strong>15 minutes</strong>. Do not share it with anyone.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `;
    await sendMail(user.email, "Password Reset OTP", html);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new EntityNotFound({ message: "user not found", statusCode: 404 });
    }

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.user_id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!resetToken) {
      throw new AuthenticationError({
        message: "invalid or expired OTP",
        statusCode: 400,
      });
    }

    const validOtp = await PasswordUtils.verifyPassword(otp, resetToken.token);
    if (!validOtp) {
      throw new AuthenticationError({ message: "invalid OTP", statusCode: 400 });
    }

    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    const hashedPassword = await PasswordUtils.hashPassword(newPassword);
    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { password: hashedPassword },
    });
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new EntityNotFound({ message: "user not found", statusCode: 404 });
    }

    const validPassword = await PasswordUtils.verifyPassword(currentPassword, user.password);
    if (!validPassword) {
      throw new AuthenticationError({
        message: "current password is incorrect",
        statusCode: 400,
      });
    }

    const hashedPassword = await PasswordUtils.hashPassword(newPassword);
    await prisma.user.update({
      where: { user_id: userId },
      data: { password: hashedPassword },
    });
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

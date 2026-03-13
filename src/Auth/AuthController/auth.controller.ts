import { Request, Response } from "express";
import { ILogin } from "@auth/admin.js";
import AuthService from "@auth/AuthServices/auth.service.js";
import {
  createAdmin,
  userProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from "@/utils/validations.js";

const authService = new AuthService();

class AuthController {
  async createAdmin(req: Request, res: Response) {
    const admin = createAdmin.safeParse(req.body.user);
    const profile = userProfile.safeParse(req.body.profile);
    if (admin.success && profile.success) {
      const registerAdmin = await authService.createAdmin(
        admin.data,
        profile.data
      );
      console.log(registerAdmin);
      res.status(200).json({
        message: "admin created successfully",
        data: registerAdmin,
      });
    } else {
      res.status(400).json({ error: admin.error });
    }
  }

  async login(req: Request, res: Response) {
    const ipAddress = req.ip || "";
    const userLogin: ILogin = req.body;
    const user = await authService.login(userLogin, ipAddress);
    res.status(201).json({ message: "user login successfully", data: user });
  }

  async forgotPassword(req: Request, res: Response) {
    const parsed = forgotPassword.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    await authService.forgotPassword(parsed.data.email);
    res.status(200).json({ message: "OTP sent to your email address" });
  }

  async resetPassword(req: Request, res: Response) {
    const parsed = resetPassword.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const { email, otp, newPassword } = parsed.data;
    await authService.resetPassword(email, otp, newPassword);
    res.status(200).json({ message: "password reset successfully" });
  }

  async changePassword(req: Request, res: Response) {
    const parsed = changePassword.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    const userId = req.user!.user_id;
    const { currentPassword, newPassword } = parsed.data;
    await authService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "password changed successfully" });
  }
}

export default AuthController;

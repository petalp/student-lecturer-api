import { Request, Response } from "express";
import { ICreateAdmin, ILogin } from "../admin";
import AuthService from "../AuthServices/auth.service";

const authService = new AuthService();

class AuthController {
  async createAdmin(req: Request, res: Response) {
    const admin: ICreateAdmin = req.body;
    const registerAdmin = await authService.createAdmin(admin);
    res.status(200).json({
      message: "admin created successfully",
      data: registerAdmin,
    });
  }
  async login(req: Request, res: Response) {
    const ipAddress = req.ip || "";
    const userLogin: ILogin = req.body;
    const user = await authService.login(userLogin, ipAddress);
    res.status(201).json({ message: "user login successfully", data: user });
  }
}

export default AuthController;

import { Request, Response } from "express";
import { ICreateAdmin } from "../admin";
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
}

export default AuthController;

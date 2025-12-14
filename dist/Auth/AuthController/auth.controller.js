"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../AuthServices/auth.service"));
const validations_1 = require("../../utils/validations");
const authService = new auth_service_1.default();
class AuthController {
    async createAdmin(req, res) {
        const admin = validations_1.createAdmin.safeParse(req.body.user);
        const profile = validations_1.userProfile.safeParse(req.body.profile);
        if (admin.success && profile.success) {
            const registerAdmin = await authService.createAdmin(admin.data, profile.data);
            console.log(registerAdmin);
            res.status(200).json({
                message: "admin created successfully",
                data: registerAdmin,
            });
        }
        else {
            res.status(400).json({ error: admin.error });
        }
    }
    async login(req, res) {
        const ipAddress = req.ip || "";
        const userLogin = req.body;
        const user = await authService.login(userLogin, ipAddress);
        res.status(201).json({ message: "user login successfully", data: user });
    }
}
exports.default = AuthController;

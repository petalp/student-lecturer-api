import AuthService from "../AuthServices/auth.service";
import { createAdmin, userProfile } from "../../utils/validations";
const authService = new AuthService();
class AuthController {
    async createAdmin(req, res) {
        const admin = createAdmin.safeParse(req.body.user);
        const profile = userProfile.safeParse(req.body.profile);
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
export default AuthController;

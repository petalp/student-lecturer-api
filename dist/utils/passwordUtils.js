import bcrypt from "bcryptjs";
export default class PasswordUtils {
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    static async verifyPassword(password, passwordHash) {
        return await bcrypt.compare(password, passwordHash);
    }
}

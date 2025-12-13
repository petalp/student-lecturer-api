"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@/config/config");
const database_1 = require("@/config/database");
const CustomError_1 = require("@/error/CustomError");
const jwtUtils_1 = __importDefault(require("@/utils/jwtUtils"));
const passwordUtils_1 = __importDefault(require("@/utils/passwordUtils"));
class AuthService {
    async createAdmin(admin, profile) {
        const checkAdminExist = await database_1.prisma.user.findUnique({
            where: { email: admin.email },
        });
        if (checkAdminExist) {
            throw new CustomError_1.EntityExistError({
                message: "admin already exist",
                statusCode: 400,
            });
        }
        const hashedPassword = await passwordUtils_1.default.hashPassword(admin.password);
        const result = await database_1.prisma.$transaction(async (tsx) => {
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
    async login(loginInput, ipAddress) {
        let user = await database_1.prisma.user.findUnique({
            where: { email: loginInput.email },
        });
        if (!user) {
            throw new CustomError_1.EntityNotFound({ message: "user not found", statusCode: 404 });
        }
        const passwordValid = await passwordUtils_1.default.verifyPassword(loginInput.password, user.password);
        if (!passwordValid) {
            throw new CustomError_1.AuthenticationError({
                message: "password is incorrect",
                statusCode: 400,
            });
        }
        //check for user
        if (user.role === "ADMIN") {
            user = user;
        }
        else if (user.role === "STUDENT") {
            user = await database_1.prisma.user.findUnique({
                where: { email: user.email },
                include: {
                    student: true,
                },
            });
        }
        else if (user.role === "LECTURER") {
            user = await database_1.prisma.user.findUnique({
                where: { email: user.email },
                include: {
                    lecturer: true,
                },
            });
        }
        const tokens = await this.generateToken(user, ipAddress);
        return { user, token: { ...tokens } };
    }
    async generateToken(user, address) {
        const payload = {
            email: user.email,
            user_id: user.user_id,
            username: user.username,
            role: user.role,
        };
        const accessToken = jwtUtils_1.default.generateAccessToken(payload, config_1.config.Jwt.jwtAccessSecret, config_1.config.Jwt.jwtAccessExpiresAt);
        const refreshToken = jwtUtils_1.default.generateRefreshToken(payload, config_1.config.Jwt.jwtRefreshSecret, config_1.config.Jwt.jwtRefreshExpiresAt);
        console.log("-------------------------------------------------");
        console.log(refreshToken, ":", refreshToken.length);
        console.log("-------------------------------------------------");
        console.log(accessToken, ":", accessToken.length);
        console.log("-------------------------------------------------");
        await database_1.prisma.tokens.create({
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
exports.default = AuthService;

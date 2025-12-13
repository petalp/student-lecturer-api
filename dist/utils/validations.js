"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = exports.createAdmin = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
exports.createAdmin = zod_1.default.object({
    firstName: zod_1.default.coerce.string(),
    lastName: zod_1.default.coerce.string(),
    middleName: zod_1.default.coerce.string().optional(),
    username: zod_1.default.coerce.string().nonempty(),
    email: zod_1.default.email().nonempty(),
    password: zod_1.default.coerce.string(),
    isActive: zod_1.default.coerce.boolean(),
    role: zod_1.default.enum([client_1.Role.ADMIN, client_1.Role.LECTURER, client_1.Role.STUDENT]),
    sex: zod_1.default.coerce.string(),
});
exports.userProfile = zod_1.default.object({
    address: zod_1.default.coerce.string(),
    city: zod_1.default.coerce.string(),
    coutry: zod_1.default.coerce.string(),
    phoneNumber: zod_1.default.coerce.string(),
    dateOfBirth: zod_1.default.coerce.string(),
});

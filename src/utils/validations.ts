import z from "zod";
import { Role } from "@/generated/prisma/enums.js";

export const createAdmin = z.object({
  firstName: z.coerce.string(),
  lastName: z.coerce.string(),
  middleName: z.coerce.string().optional(),
  username: z.coerce.string().nonempty(),
  email: z.email().nonempty(),
  password: z.coerce.string(),
  isActive: z.coerce.boolean(),
  role: z.enum([Role.ADMIN, Role.LECTURER, Role.STUDENT]),
  sex: z.coerce.string(),
});

export const userProfile = z.object({
  address: z.coerce.string(),
  city: z.coerce.string(),
  coutry: z.coerce.string(),
  phoneNumber: z.coerce.string(),
  dateOfBirth: z.coerce.string(),
});

export const forgotPassword = z.object({
  email: z.email().nonempty(),
});

export const resetPassword = z.object({
  email: z.email().nonempty(),
  otp: z.coerce.string().nonempty(),
  newPassword: z.coerce.string().min(6),
});

export const changePassword = z.object({
  currentPassword: z.coerce.string().nonempty(),
  newPassword: z.coerce.string().min(6),
});

export type IAdmin = z.infer<typeof createAdmin>;
export type IuserProfile = z.infer<typeof userProfile>;
export type IForgotPassword = z.infer<typeof forgotPassword>;
export type IResetPassword = z.infer<typeof resetPassword>;
export type IChangePassword = z.infer<typeof changePassword>;

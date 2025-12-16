import z, { ipv4 } from "zod";
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

export type IAdmin = z.infer<typeof createAdmin>;
export type IuserProfile = z.infer<typeof userProfile>;

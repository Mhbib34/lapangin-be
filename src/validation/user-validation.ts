import z, { ZodType } from "zod";
import { CreateUserRequest, LoginUserRequest } from "../model/user-model";

export class UserValidation {
  static readonly CREATE: ZodType<CreateUserRequest> = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  });
  static readonly LOGIN: ZodType<LoginUserRequest> = z.object({
    password: z.string(),
    email: z.string().email(),
  });
}

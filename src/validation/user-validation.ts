import z, { ZodType } from "zod";
import { CreateUserRequest } from "../model/user-model";

export class UserValidation {
  static readonly CREATE: ZodType<CreateUserRequest> = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  });
}

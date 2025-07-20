import z, { ZodType } from "zod";
import {
  CreateUserRequest,
  LoginUserRequest,
  ResetPasswordRequest,
  SendResetPWOtpRequest,
  UpdateUserRequest,
  VerifyEmailRequest,
} from "../model/user-model";

export class UserValidation {
  static readonly CREATE: ZodType<CreateUserRequest> = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    name: z.string().min(1).max(100),
    email: z.string().email().min(1).max(100),
    role: z.enum(["USER", "ADMIN"]).optional(),
  });
  static readonly UPDATE: ZodType<UpdateUserRequest> = z.object({
    username: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
    name: z.string().min(1).max(100).optional(),
    email: z.string().min(1).max(100).email().optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  });
  static readonly LOGIN: ZodType<LoginUserRequest> = z.object({
    password: z.string().min(1).max(100),
    email: z.string().email().min(1).max(100),
  });
  static readonly RESET_PW_OTP: ZodType<SendResetPWOtpRequest> = z.object({
    email: z.string().email().min(1).max(100),
  });
  static readonly RESET_PASSWORD: ZodType<ResetPasswordRequest> = z.object({
    email: z.string().email().min(1).max(100),
    newPassword: z.string().min(1).max(100),
    otp: z.number().positive(),
  });
  static readonly VERIFY_EMAIL: ZodType<VerifyEmailRequest> = z.object({
    otp: z.number().positive(),
  });
}

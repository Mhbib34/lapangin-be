import { Role, User } from "@prisma/client";

export type CreateUserRequest = {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  role?: Role;
};
export type UpdateUserRequest = {
  username?: string;
  password?: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: Role;
};
export type LoginUserRequest = {
  email: string;
  password: string;
};
export type SendResetPWOtpRequest = {
  email: string;
};

export type UpdatePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordRequest = {
  newPassword: string;
  otp: number;
  email: string;
};
export type VerifyEmailRequest = {
  otp: number;
};
export type UserResponse = {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  isAccountVerified?: boolean;
  createdAt?: Date;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isAccountVerified: user.isAccountVerified,
    createdAt: user.createdAt,
  };
}

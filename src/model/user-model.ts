import { Role, User } from "@prisma/client";

export type CreateUserRequest = {
  username: string;
  password: string;
  name: string;
  email: string;
  role?: Role;
};
export type UserResponse = {
  id: string;
  username: string;
  name: string;
  email: string;
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
    isAccountVerified: user.isAccountVerified,
    createdAt: user.createdAt,
  };
}

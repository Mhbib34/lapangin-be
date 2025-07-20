import { Role, User } from "@prisma/client";
import { Request } from "express";

export interface UserJwtPayload {
  id: string;
  email: string;
  role: Role;
}

export interface UserRequest extends Request {
  user?: User;
}
export interface UserRequestJwt extends Request {
  user?: UserJwtPayload;
}

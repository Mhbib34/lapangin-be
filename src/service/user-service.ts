import { log } from "winston";
import { prismaClient } from "../config/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { logger } from "../config/logging";

export class UserService {
  static async create(request: CreateUserRequest): Promise<UserResponse> {
    const userRequest = Validation.validate(UserValidation.CREATE, request);
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: userRequest.email,
      },
    });

    if (findUser) throw new ResponseError(400, "Email already exist");
    userRequest.password = await bcrypt.hash(userRequest.password, 10);

    const user = await prismaClient.user.create({
      data: userRequest,
    });
    return toUserResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const userRequest = Validation.validate(UserValidation.LOGIN, request);
    const user = await prismaClient.user.findUnique({
      where: {
        email: userRequest.email,
      },
    });

    if (!user) throw new ResponseError(401, "Email or Password wrong");
    const isPasswordMatch = await bcrypt.compare(
      userRequest.password,
      user.password
    );

    if (!isPasswordMatch)
      throw new ResponseError(401, "Email or Password wrong");

    return toUserResponse(user);
  }
}

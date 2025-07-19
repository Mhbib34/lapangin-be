import { prismaClient } from "../config/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";

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
}

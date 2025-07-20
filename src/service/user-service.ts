import { log } from "winston";
import { prismaClient } from "../config/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  ResetPasswordRequest,
  SendResetPWOtpRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { logger } from "../config/logging";
import { User } from "@prisma/client";

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

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    const userRequest = Validation.validate(UserValidation.UPDATE, request);
    if (userRequest.password)
      userRequest.password = await bcrypt.hash(userRequest.password, 10);
    const userUpdate = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: userRequest,
    });
    return toUserResponse(userUpdate);
  }

  static logout() {
    return { success: true, message: "User Logout successfully" };
  }

  static async resetOtp(user: User, request: SendResetPWOtpRequest) {
    const userRequest = Validation.validate(
      UserValidation.RESET_PW_OTP,
      request
    );
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: userRequest.email,
      },
    });

    if (findUser?.resetOtpExpireAt && findUser.resetOtpExpireAt > new Date())
      throw new ResponseError(400, "OTP already sent");

    if (!findUser) throw new ResponseError(404, "Email not found");

    const otp = Math.floor(100000 + Math.random() * 900000);

    const userUpdate = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetOtp: otp,
        resetOtpExpireAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return { otp, userUpdate };
  }

  static async resetPassword(
    user: User,
    request: ResetPasswordRequest
  ): Promise<UserResponse> {
    const userRequest = Validation.validate(
      UserValidation.RESET_PASSWORD,
      request
    );
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: userRequest.email,
      },
    });

    if (!findUser) throw new ResponseError(404, "Email not found");

    if (findUser.resetOtp !== userRequest.otp)
      throw new ResponseError(400, "Invalid OTP");
    if (findUser.resetOtpExpireAt! < new Date())
      throw new ResponseError(400, "OTP Expired");

    const isPasswordSame = await bcrypt.compare(
      userRequest.newPassword,
      user.password
    );

    if (isPasswordSame)
      throw new ResponseError(400, "Password cannot be same as old password");

    const newPassword = await bcrypt.hash(userRequest.newPassword, 10);
    const userUpdate = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
        resetOtp: null,
        resetOtpExpireAt: null,
      },
    });
    return toUserResponse(userUpdate);
  }

  static async verifyOtp(user: User) {
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!findUser) throw new ResponseError(404, "Email not found");
    if (findUser.verifyOtp || findUser.verifyOtpExpireAt)
      throw new ResponseError(400, "OTP already sent");
    if (findUser.isAccountVerified)
      throw new ResponseError(400, "Account already verified");

    const otp = Math.floor(100000 + Math.random() * 900000);

    const userUpdate = await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        verifyOtp: otp,
        verifyOtpExpireAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    return { otp, userUpdate };
  }
}

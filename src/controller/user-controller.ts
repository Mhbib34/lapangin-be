import { NextFunction, Request, Response } from "express";
import {
  CreateUserRequest,
  LoginUserRequest,
  SendResetPWOtpRequest,
  UpdateUserRequest,
} from "../model/user-model";
import { UserService } from "../service/user-service";
import jwt from "jsonwebtoken";
import { UserRequest } from "../type/user-request";
import { otpEmailTemplate } from "../config/email-template";
import transporter from "../config/nodemailer";

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const result = await UserService.create(request);
      res.status(201).json({
        success: true,
        message: "Created User Successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginUserRequest = req.body as LoginUserRequest;
      const result = await UserService.login(request);
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: "User Login Successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const result = await UserService.get(req.user!);
      res.status(200).json({
        success: true,
        message: "Get User Successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateUserRequest = req.body as UpdateUserRequest;
      const result = await UserService.update(req.user!, request);
      res.status(200).json({
        success: true,
        message: "Update User Successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });
      return res.status(200).json(UserService.logout());
    } catch (error) {
      next(error);
    }
  }

  static async resetOtp(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SendResetPWOtpRequest = req.body as SendResetPWOtpRequest;
      const { otp, userUpdate } = await UserService.resetOtp(
        req.user!,
        request
      );
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: userUpdate.email,
        subject: `Account Verify OTP!`,
        html: otpEmailTemplate(userUpdate.name, otp, "verify your email"),
      };
      await transporter.sendMail(mailOption);
      res.status(200).json({
        success: true,
        message: "OTP has sent to your email",
      });
    } catch (error) {
      next(error);
    }
  }
}

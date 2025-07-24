import { NextFunction, Request, Response } from "express";
import {
  CreateUserRequest,
  LoginUserRequest,
  ResetPasswordRequest,
  SendResetPWOtpRequest,
  UpdateUserRequest,
  VerifyEmailRequest,
} from "../model/user-model";
import { UserService } from "../service/user-service";
import { UserRequest } from "../type/user-request";
import {
  otpEmailTemplate,
  welcomeEmailTemplate,
} from "../config/email-template";
import transporter from "../config/nodemailer";
import { JwtUtils } from "../utils/jwt";

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const result = await UserService.create(request);
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: result.email,
        subject: `Welcome ${result.name}!`,
        html: welcomeEmailTemplate(result.email, result.name),
      };
      await transporter.sendMail(mailOption);
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
      JwtUtils.generateToken(res, result);
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
      JwtUtils.clearToken(res);
      return res.status(200).json(UserService.logout());
    } catch (error) {
      next(error);
    }
  }

  static async resetOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SendResetPWOtpRequest = req.body as SendResetPWOtpRequest;
      const { otp, userUpdate } = await UserService.resetOtp(request);
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: userUpdate.email,
        subject: `Reset Password OTP!`,
        html: otpEmailTemplate(userUpdate.name, otp, "reset your password"),
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
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const request: ResetPasswordRequest = req.body as ResetPasswordRequest;
      await UserService.resetPassword(request);
      JwtUtils.clearToken(res);
      res.status(200).json({
        success: true,
        message: "Update password successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyOtp(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { otp, userUpdate } = await UserService.verifyOtp(req.user!);
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

  static async verifyEmail(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: VerifyEmailRequest = req.body as VerifyEmailRequest;
      await UserService.verifyEmail(req.user!, request);
      res.status(200).json({
        success: true,
        message: "Verify email successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

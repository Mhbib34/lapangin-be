import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, LoginUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import jwt from "jsonwebtoken";
import { UserRequest } from "../type/user-request";

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
}

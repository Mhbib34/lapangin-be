import { NextFunction, Request, Response } from "express";
import { CreateUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";

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
}

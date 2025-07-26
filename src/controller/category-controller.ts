import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../service/category-service";

export class CategoryController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.list();
      res.status(200).json({
        success: true,
        message: "List category successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

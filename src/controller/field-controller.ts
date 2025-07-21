import { NextFunction, Request, Response } from "express";
import { CreateFieldRequest } from "../model/field-model";
import { FieldService } from "../service/field-service";

export class FieldController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateFieldRequest = {
        ...req.body,
        pricePerHour: Number(req.body.pricePerHour),
        image: req.file?.path,
      };
      const result = await FieldService.create(request);
      res.status(201).json({
        success: true,
        message: "Create field successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

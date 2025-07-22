import { NextFunction, Request, Response } from "express";
import { CreateFieldRequest, UpdateFieldRequest } from "../model/field-model";
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
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdateFieldRequest = {
        ...req.body,
        pricePerHour: Number(req.body.pricePerHour),
        image: req.file?.path,
      };
      request.id = req.params.fieldId;
      const result = await FieldService.update(request.id, request);
      res.status(200).json({
        success: true,
        message: "Update field successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await FieldService.get(req.params.fieldId);
      res.status(200).json({
        success: true,
        message: "Get field successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await FieldService.remove(req.params.fieldId);
      res.status(200).json({
        success: true,
        message: "Remove field successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

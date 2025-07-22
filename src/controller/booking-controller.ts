import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateBookingRequest } from "../model/booking-model";
import { BookingService } from "../service/booking-service";

export class BookingController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateBookingRequest = req.body as CreateBookingRequest;
      const result = await BookingService.create(req.user!, request);
      res.status(201).json({
        success: true,
        message: "Create booking successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

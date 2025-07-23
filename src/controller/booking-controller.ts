import { NextFunction, Response, Request } from "express";
import { UserRequest } from "../type/user-request";
import {
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from "../model/booking-model";
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

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;

      const result = await BookingService.list(page, size);
      res.status(200).json({
        success: true,
        message: "List booking successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const result = await BookingService.get(req.user!);
      res.status(200).json({
        success: true,
        message: "Get booking successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const request: UpdateBookingStatusRequest =
        req.body as UpdateBookingStatusRequest;
      await BookingService.updateStatus(req.params.bookingId, request);
      res.status(200).json({
        success: true,
        message: "Update booking status successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await BookingService.remove(req.params.bookingId);
      res.status(200).json({
        success: true,
        message: "Remove booking successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

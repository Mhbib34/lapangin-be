import { User } from "@prisma/client";
import {
  BookingResponse,
  CreateBookingRequest,
  toBookingResponse,
} from "../model/booking-model";
import { Validation } from "../validation/validation";
import { BookingValidation } from "../validation/booking-validation";
import { FieldService } from "./field-service";
import { prismaClient } from "../config/database";

export class BookingService {
  static async create(
    user: User,
    request: CreateBookingRequest
  ): Promise<BookingResponse> {
    const bookingRequest = Validation.validate(
      BookingValidation.CREATE,
      request
    );
    await FieldService.checkFieldMustExist(bookingRequest.fieldId);
    const booking = await prismaClient.booking.create({
      data: {
        fieldId: bookingRequest.fieldId,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
        userId: user.id,
      },
      include: {
        field: {
          select: {
            id: true,
            name: true,
            location: true,
            description: true,
            image: true,
            pricePerHour: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const durationHours = Math.ceil(
      (booking.endTime.getTime() - booking.startTime.getTime()) /
        (1000 * 60 * 60)
    );

    const totalPrice = booking.field.pricePerHour * durationHours;

    return toBookingResponse(booking, booking.field, durationHours, totalPrice);
  }
}

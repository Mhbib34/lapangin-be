import { User } from "@prisma/client";
import {
  BookingFieldResponse,
  BookingResponse,
  CreateBookingRequest,
  toBookingResponse,
} from "../model/booking-model";
import { Validation } from "../validation/validation";
import { BookingValidation } from "../validation/booking-validation";
import { FieldService } from "./field-service";
import { prismaClient } from "../config/database";
import { pagingResponse } from "../model/page";

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

  static async list(
    page: number = 1,
    size: number = 10
  ): Promise<pagingResponse<BookingResponse>> {
    // Hitung offset
    const skip = (page - 1) * size;

    // Ambil total data untuk hitung total_page
    const totalData = await prismaClient.booking.count();

    // Ambil data dengan relasi field + category
    const bookings = await prismaClient.booking.findMany({
      skip,
      take: size,
      orderBy: { createdAt: "desc" },
      include: {
        field: {
          include: {
            category: true,
          },
        },
      },
    });

    // Transform jadi BookingResponse
    const data: BookingResponse[] = bookings.map((booking) => {
      const durationHours =
        (booking.endTime.getTime() - booking.startTime.getTime()) /
        1000 /
        60 /
        60;

      const totalPrice = durationHours * booking.field.pricePerHour;

      const field: BookingFieldResponse = {
        id: booking.field.id,
        name: booking.field.name,
        location: booking.field.location,
        description: booking.field.description,
        image: booking.field.image,
        pricePerHour: booking.field.pricePerHour,
        category: {
          name: booking.field.category.name,
        },
      };

      return toBookingResponse(booking, field, durationHours, totalPrice);
    });

    // Bentuk response paging
    const paging = {
      size,
      total_page: Math.ceil(totalData / size),
      current_page: page,
    };

    return { data, paging };
  }
}

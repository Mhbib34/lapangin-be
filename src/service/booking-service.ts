import { User } from "@prisma/client";
import {
  BookingFieldResponse,
  BookingResponse,
  BookingWithField,
  CreateBookingRequest,
  toBookingResponse,
  UpdateBookingStatusRequest,
} from "../model/booking-model";
import { Validation } from "../validation/validation";
import { BookingValidation } from "../validation/booking-validation";
import { FieldService } from "./field-service";
import { prismaClient } from "../config/database";
import { pagingResponse } from "../model/page";
import { ResponseError } from "../error/response-error";

function transformBookingToResponse(
  bookings: BookingWithField[]
): BookingResponse[] {
  return bookings.map((booking) => {
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

    return toBookingResponse(
      booking,
      field,
      booking.user,
      durationHours,
      totalPrice
    );
  });
}

export class BookingService {
  static async checkBookingMustExist(bookingId: string) {
    const booking = await prismaClient.booking.findUnique({
      where: {
        id: bookingId,
      },
    });
    if (!booking) {
      throw new ResponseError(404, "Booking not found");
    }
    return booking;
  }
  static async create(
    user: User,
    request: CreateBookingRequest
  ): Promise<BookingResponse> {
    const bookingRequest = Validation.validate(
      BookingValidation.CREATE,
      request
    );
    await FieldService.checkFieldMustExist(bookingRequest.fieldId);

    const now = new Date();

    if (bookingRequest.startTime >= bookingRequest.endTime) {
      throw new ResponseError(400, "Start time must be before end time");
    }

    if (bookingRequest.startTime < now) {
      throw new ResponseError(400, "Start time must be in the future");
    }

    const findBooking = await prismaClient.booking.findFirst({
      where: {
        fieldId: bookingRequest.fieldId,
        startTime: {
          lte: bookingRequest.endTime,
        },
        endTime: {
          gt: bookingRequest.startTime,
        },
      },
    });

    if (findBooking) {
      throw new ResponseError(400, "Booking already exists");
    }

    const booking = await prismaClient.booking.create({
      data: {
        fieldId: bookingRequest.fieldId,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            isAccountVerified: true,
            createdAt: true,
          },
        },
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

    return toBookingResponse(
      booking,
      booking.field,
      booking.user,
      durationHours,
      totalPrice
    );
  }

  static async list(
    page: number = 1,
    size: number = 10
  ): Promise<pagingResponse<BookingResponse>> {
    const skip = (page - 1) * size;
    const totalData = await prismaClient.booking.count();

    const bookings = await prismaClient.booking.findMany({
      skip,
      take: size,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            isAccountVerified: true,
            createdAt: true,
          },
        },
        field: {
          include: {
            category: true,
          },
        },
      },
    });

    const data = transformBookingToResponse(bookings);

    const paging = {
      size,
      total_page: Math.ceil(totalData / size),
      current_page: page,
    };

    return { data, paging };
  }

  static async get(user: User): Promise<BookingResponse[]> {
    const bookings = await prismaClient.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            isAccountVerified: true,
            createdAt: true,
          },
        },
        field: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!bookings) throw new ResponseError(404, "Bookings not found");

    const data = transformBookingToResponse(bookings);

    return data;
  }

  static async updateStatus(
    bookingId: string,
    request: UpdateBookingStatusRequest
  ): Promise<BookingResponse> {
    const statusRequest = Validation.validate(
      BookingValidation.UPDATE_STATUS,
      request
    );
    await this.checkBookingMustExist(bookingId);
    const booking = await prismaClient.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: statusRequest.status,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            isAccountVerified: true,
            createdAt: true,
          },
        },
        field: {
          include: {
            category: true,
          },
        },
      },
    });
    return toBookingResponse(booking, booking.field, booking.user);
  }

  static async remove(bookingId: string) {
    await this.checkBookingMustExist(bookingId);
    await prismaClient.booking.delete({
      where: {
        id: bookingId,
      },
    });
  }
}

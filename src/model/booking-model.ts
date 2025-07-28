import { Booking, BookingStatus, Category, Field } from "@prisma/client";
import { UserResponse } from "./user-model";

export type CreateBookingRequest = {
  fieldId: string;
  startTime: Date;
  endTime: Date;
};

export type BookingFieldResponse = {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  image: string | null;
  pricePerHour: number;
  category: {
    name: string;
  };
};

export type BookingResponse = {
  bookingId: string;
  userId: string;
  user: UserResponse;
  field: BookingFieldResponse;
  startTime: Date;
  endTime: Date;
  durationHours?: number;
  totalPrice?: number;
  status: BookingStatus;
  createdAt: Date;
};

export type UpdateBookingStatusRequest = {
  status: BookingStatus;
};

export type BookingWithField = Booking & {
  field: Field & {
    category: Category;
  };
  user: UserResponse;
};
export function toBookingResponse(
  booking: Booking,
  field: BookingFieldResponse,
  user: UserResponse,
  durationHours?: number,
  totalPrice?: number
): BookingResponse {
  return {
    bookingId: booking.id,
    userId: booking.userId,
    field,
    user,
    startTime: booking.startTime,
    endTime: booking.endTime,
    durationHours,
    totalPrice,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

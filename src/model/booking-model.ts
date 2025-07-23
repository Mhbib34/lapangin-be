import { Booking, BookingStatus, Field } from "@prisma/client";
import { FieldResponse } from "./field-model";

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
  field: BookingFieldResponse;
  startTime: Date;
  endTime: Date;
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
};

export function toBookingResponse(
  booking: Booking,
  field: BookingFieldResponse,
  durationHours: number,
  totalPrice: number
): BookingResponse {
  return {
    bookingId: booking.id,
    userId: booking.userId,
    field: field,
    startTime: booking.startTime,
    endTime: booking.endTime,
    durationHours,
    totalPrice,
    status: booking.status,
    createdAt: booking.createdAt,
  };
}

import { Booking, BookingStatus, Field } from "@prisma/client";

export type CreateBookingRequest = {
  fieldId: string;
  startTime: Date;
  endTime: Date;
};

export type BookingResponse = {
  bookingId: string;
  userId: string;
  field: Field;
  startTime: Date;
  endTime: Date;
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
};

export function toBookingResponse(
  booking: Booking,
  field: Field,
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

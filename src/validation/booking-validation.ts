import z, { ZodType } from "zod";
import {
  CreateBookingRequest,
  UpdateBookingStatusRequest,
} from "../model/booking-model";

export class BookingValidation {
  static readonly CREATE: ZodType<CreateBookingRequest> = z.object({
    fieldId: z.string().min(1).max(100),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  });

  static readonly UPDATE_STATUS: ZodType<UpdateBookingStatusRequest> = z.object(
    {
      status: z.enum(["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"]),
    }
  );
}

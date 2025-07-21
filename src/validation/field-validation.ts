import z, { ZodType } from "zod";
import { CreateFieldRequest } from "../model/field-model";

export class FieldValidation {
  static readonly CREATE: ZodType<CreateFieldRequest> = z.object({
    name: z.string().min(1).max(100),
    location: z.string().min(1).max(100),
    description: z.string().min(1).max(100).optional(),
    image: z.string().min(1).max(100).optional(),
    pricePerHour: z.number().positive(),
    category: z.string().min(1).max(100),
  });
}

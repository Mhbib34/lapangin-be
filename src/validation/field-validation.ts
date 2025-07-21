import z, { ZodType } from "zod";
import { CreateFieldRequest, UpdateFieldRequest } from "../model/field-model";

export class FieldValidation {
  static readonly CREATE: ZodType<CreateFieldRequest> = z.object({
    name: z.string().min(1).max(100),
    location: z.string().min(1).max(100),
    description: z.string().min(1).max(100).optional(),
    image: z.string().min(1).max(100).optional(),
    pricePerHour: z.number().positive(),
    category: z.string().min(1).max(100),
  });
  static readonly UPDATE: ZodType<UpdateFieldRequest> = z.object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(100).optional(),
    location: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(100).optional(),
    image: z.string().min(1).max(100).optional(),
    pricePerHour: z.number().positive().optional(),
    category: z.string().min(1).max(100).optional(),
  });
}

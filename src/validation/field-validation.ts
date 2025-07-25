import z, { ZodType } from "zod";
import {
  CreateFieldRequest,
  SearchFieldRequest,
  UpdateFieldRequest,
} from "../model/field-model";

export class FieldValidation {
  static readonly CREATE: ZodType<CreateFieldRequest> = z.object({
    name: z.string().min(1).max(100),
    location: z.string().min(1).max(100),
    description: z.string().min(1).max(100).optional(),
    image: z.string().min(1).max(100).optional(),
    pricePerHour: z.number().positive(),
    category: z.string().min(1).max(100),
    operationalHour: z.string().min(1).max(100).optional(),
    capacity: z.number().positive(),
    status: z.enum(["ACTIVE", "NONACTIVE", "MAINTENANCE"]).optional(),
  });
  static readonly UPDATE: ZodType<UpdateFieldRequest> = z.object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(100).optional(),
    location: z.string().min(1).max(100).optional(),
    description: z.string().min(1).max(100).optional(),
    image: z.string().min(1).max(100).optional(),
    pricePerHour: z.number().positive().optional(),
    category: z.string().min(1).max(100).optional(),
    operationalHour: z.string().min(1).max(100).optional(),
    capacity: z.number().positive(),
    status: z.enum(["ACTIVE", "NONACTIVE", "MAINTENANCE"]).optional(),
  });

  static readonly SEARCH: ZodType<SearchFieldRequest> = z.object({
    name: z.string().min(1).max(100).optional(),
    location: z.string().min(1).max(100).optional(),
    category: z.string().min(1).max(100).optional(),
    page: z.number().positive().min(1),
    size: z.number().positive().min(1).max(100),
  });
}

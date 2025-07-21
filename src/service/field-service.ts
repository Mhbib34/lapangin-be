import {
  CreateFieldRequest,
  FieldResponse,
  toFieldResponse,
} from "../model/field-model";
import { FieldValidation } from "../validation/field-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../config/database";

export class FieldService {
  static async create(request: CreateFieldRequest): Promise<FieldResponse> {
    const fieldRequest = Validation.validate(FieldValidation.CREATE, request);
    const field = await prismaClient.field.create({
      data: {
        ...fieldRequest,
        category: {
          connectOrCreate: {
            where: {
              name: fieldRequest.category,
            },
            create: {
              name: fieldRequest.category,
            },
          },
        },
      },
      include: {
        category: true,
      },
    });
    return toFieldResponse(field, field.category);
  }
}

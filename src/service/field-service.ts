import {
  CreateFieldRequest,
  FieldResponse,
  toFieldResponse,
  UpdateFieldRequest,
} from "../model/field-model";
import { FieldValidation } from "../validation/field-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../config/database";
import { ResponseError } from "../error/response-error";

export class FieldService {
  static async checkFieldMustExist(fieldId: string) {
    const field = await prismaClient.field.findUnique({
      where: {
        id: fieldId,
      },
      include: {
        category: true,
      },
    });

    if (!field) {
      throw new ResponseError(404, "Field not found");
    }
    return field;
  }
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

  static async update(
    fieldId: string,
    request: UpdateFieldRequest
  ): Promise<FieldResponse> {
    const fieldRequest = Validation.validate(FieldValidation.UPDATE, request);
    await this.checkFieldMustExist(fieldId);

    const fieldUpdate = await prismaClient.field.update({
      where: {
        id: fieldRequest.id,
      },
      data: {
        ...fieldRequest,
        category: {
          connectOrCreate: {
            where: {
              name: fieldRequest.category,
            },
            create: {
              name: fieldRequest.category!,
            },
          },
        },
      },
      include: {
        category: true,
      },
    });
    return toFieldResponse(fieldUpdate, fieldUpdate.category);
  }

  static async get(id: string): Promise<FieldResponse> {
    const field = await this.checkFieldMustExist(id);
    return toFieldResponse(field, field.category);
  }
  static async remove(id: string): Promise<FieldResponse> {
    const field = await this.checkFieldMustExist(id);

    await prismaClient.field.delete({
      where: {
        id,
      },
    });

    return toFieldResponse(field, field.category);
  }
}

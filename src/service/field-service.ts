import {
  CreateFieldRequest,
  FieldResponse,
  SearchFieldRequest,
  toFieldResponse,
  UpdateFieldRequest,
} from "../model/field-model";
import { FieldValidation } from "../validation/field-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../config/database";
import { ResponseError } from "../error/response-error";
import { pagingResponse } from "../model/page";

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

  static async search(
    request: SearchFieldRequest
  ): Promise<pagingResponse<FieldResponse>> {
    const searchRequest = Validation.validate(FieldValidation.SEARCH, request);
    const skip = (searchRequest.page - 1) * searchRequest.size;

    const filters = [];
    if (searchRequest.name) {
      filters.push({
        name: {
          contains: searchRequest.name,
        },
      });
    }
    if (searchRequest.location) {
      filters.push({
        location: {
          contains: searchRequest.location,
        },
      });
    }
    if (searchRequest.category) {
      filters.push({
        category: {
          name: {
            contains: searchRequest.category,
          },
        },
      });
    }

    const fields = await prismaClient.field.findMany({
      where: {
        AND: filters,
      },
      include: {
        category: true,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await prismaClient.field.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: fields.map((field) => toFieldResponse(field, field.category)),
      paging: {
        current_page: searchRequest.page,
        total_page: Math.ceil(total / searchRequest.size),
        size: searchRequest.size,
      },
    };
  }
}

import { prismaClient } from "../config/database";
import { toCategoryResponse } from "../model/category-model";

export class CategoryService {
  static async list() {
    const categories = await prismaClient.category.findMany();

    return categories.map(toCategoryResponse);
  }
}

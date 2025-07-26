import { Category } from "@prisma/client";

export type CategoryResponse = {
  id: string;
  name: string;
};

export function toCategoryResponse(category: Category): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
  };
}

import { Category, Field } from "@prisma/client";

export type CreateFieldRequest = {
  name: string;
  location: string;
  description?: string;
  image?: string;
  pricePerHour: number;
  category: string;
};

export type FieldResponse = {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  image?: string | null;
  pricePerHour: number;
  category: string;
};

export function toFieldResponse(
  field: Field,
  category: Category
): FieldResponse {
  return {
    id: field.id,
    name: field.name,
    location: field.location,
    description: field.description,
    image: field.image,
    pricePerHour: field.pricePerHour,
    category: category.name,
  };
}

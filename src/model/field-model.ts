import { Category, Field, FieldStatus } from "@prisma/client";

export type CreateFieldRequest = {
  name: string;
  location: string;
  description?: string;
  image?: string;
  pricePerHour: number;
  category: string;
  operationalHour?: string;
  capacity: number;
  status?: FieldStatus;
};
export type UpdateFieldRequest = {
  id: string;
  name?: string;
  location?: string;
  description?: string;
  image?: string;
  pricePerHour?: number;
  category?: string;
  operationalHour?: string;
  capacity: number;
  status?: FieldStatus;
};

export type FieldResponse = {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  image?: string | null;
  pricePerHour: number;
  category: string;
  operationalHour?: string | null;
  capacity: number;
  status?: FieldStatus | null;
};

export type SearchFieldRequest = {
  name?: string;
  location?: string;
  category?: string;
  page: number;
  size: number;
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
    operationalHour: field.operationalHour,
    capacity: field.capacity,
    status: field.status,
    category: category.name,
  };
}

import httpService from "../../services/api.ts";
import type { PaginatedResponse } from "../../services/types.ts";

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const data = await httpService.get<PaginatedResponse<Category>>("/categories/?limit=100");

  return data.results;
};

import httpService from "../../services/api.ts";
import type { PaginatedResponse } from "../../services/types.ts";

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await httpService.request({
    url: "/categories/?limit=100",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Categories cannot be retrieved.");
  }

  const data: PaginatedResponse<Category> = await response.json();

  return data.results;
};

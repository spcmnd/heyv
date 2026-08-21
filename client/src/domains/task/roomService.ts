import httpService from "../../services/api.ts";
import type { PaginatedResponse } from "../../services/types.ts";

export interface Room {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getRooms = async (): Promise<Room[]> => {
  const data = await httpService.get<PaginatedResponse<Room>>("/rooms/?limit=100");

  return data.results;
};

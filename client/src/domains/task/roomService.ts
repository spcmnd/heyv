import httpService from "../../services/api.ts";
import type { PaginatedResponse } from "../../services/types.ts";

export interface Room {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getRooms = async (): Promise<Room[]> => {
  const response = await httpService.request({
    url: "/rooms/?limit=100",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Rooms cannot be retrieved.");
  }

  const data: PaginatedResponse<Room> = await response.json();

  return data.results;
};

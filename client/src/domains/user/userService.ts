import httpService from "../../services/api.ts";
import type { User } from "./types/user.ts";

interface UserResponse {
  username: string;
  first_name: string;
}

export const getUser = async (id: number | "me"): Promise<User> => {
  const user = await httpService.get<UserResponse>(`/user/${id}/`);

  return {
    username: user.username,
    firstName: user.first_name,
  };
};

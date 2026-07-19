import httpService from "../../services/api.ts";
import type { User } from "./types/user.ts";

const url = "/user";

export const getUser = async (id: number | "me"): Promise<User> => {
  const response = await httpService.request({
    url: `${url}/${id}`,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("User cannot be retrieved.");
  }

  const user = await response.json();

  return {
    username: user.username,
    firstName: user.first_name,
  };
};

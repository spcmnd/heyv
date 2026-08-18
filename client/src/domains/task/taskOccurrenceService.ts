import httpService from "../../services/api.ts";
import type { PaginatedResponse } from "../../services/types.ts";
import type { TaskOccurrence, TaskOccurrenceStatus } from "./types/taskOccurrence.ts";

const url = "/task-occurrences";

export const getTaskOccurrences = async (
  status: TaskOccurrenceStatus,
): Promise<TaskOccurrence[]> => {
  const response = await httpService.request({
    url: `${url}/?status=${status}&limit=100`,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Tasks cannot be retrieved.");
  }

  const data: PaginatedResponse<TaskOccurrence> = await response.json();

  return data.results;
};

export interface TaskOccurrenceFilters {
  status?: TaskOccurrenceStatus;
  from?: string;
  to?: string;
  limit?: number;
}

export const getFilteredTaskOccurrences = async (
  filters: TaskOccurrenceFilters = {},
): Promise<PaginatedResponse<TaskOccurrence>> => {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.from) {
    params.set("from", filters.from);
  }

  if (filters.to) {
    params.set("to", filters.to);
  }

  if (filters.limit) {
    params.set("limit", String(filters.limit));
  }

  const response = await httpService.request({
    url: `${url}/?${params.toString()}`,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Tasks cannot be retrieved.");
  }

  return response.json();
};

export const completeTaskOccurrence = async (id: number): Promise<TaskOccurrence> => {
  const response = await httpService.request({
    url: `${url}/${id}/complete/`,
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Task cannot be completed.");
  }

  return response.json();
};

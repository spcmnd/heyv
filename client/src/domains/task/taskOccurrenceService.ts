import httpService from "../../services/api.ts";
import type { TaskOccurrence, TaskOccurrenceStatus } from "./types/taskOccurrence.ts";
import type { PaginatedResponse } from "../../services/types.ts";

const url = "/task-occurrences";

export interface TaskOccurrenceFilters {
  status?: TaskOccurrenceStatus;
  from?: string;
  to?: string;
  limit?: number;
}

export const getTaskOccurrences = async (
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

  return httpService.get<PaginatedResponse<TaskOccurrence>>(`${url}/?${params.toString()}`);
};

export const completeTaskOccurrence = async (id: number): Promise<TaskOccurrence> => {
  return httpService.post<undefined, TaskOccurrence>(`${url}/${id}/complete/`);
};

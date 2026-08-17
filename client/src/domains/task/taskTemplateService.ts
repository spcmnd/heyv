import httpService from "../../services/api.ts";
import type {
  CreateTaskTemplateInput,
  TaskTemplate,
} from "./types/taskTemplate.ts";

const url = "/task-templates";

export const createTaskTemplate = async (
  input: CreateTaskTemplateInput,
): Promise<TaskTemplate> => {
  const response = await httpService.request({
    url: `${url}/`,
    method: "POST",
    body: input,
  });

  if (!response.ok) {
    const error = new Error("Task template cannot be created.") as Error & {
      details?: unknown;
    };

    try {
      error.details = await response.json();
    } catch {
      // No error body to attach.
    }

    throw error;
  }

  return response.json();
};

export const getTaskTemplate = async (id: number): Promise<TaskTemplate> => {
  const response = await httpService.request({
    url: `${url}/${id}/`,
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Task template cannot be retrieved.");
  }

  return response.json();
};

export const updateTaskTemplate = async (
  id: number,
  input: CreateTaskTemplateInput,
): Promise<TaskTemplate> => {
  const response = await httpService.request({
    url: `${url}/${id}/`,
    method: "PATCH",
    body: input,
  });

  if (!response.ok) {
    const error = new Error("Task template cannot be updated.") as Error & {
      details?: unknown;
    };

    try {
      error.details = await response.json();
    } catch {
      // No error body to attach.
    }

    throw error;
  }

  return response.json();
};

export const archiveTaskTemplate = async (id: number): Promise<void> => {
  const response = await httpService.request({
    url: `${url}/${id}/archive/`,
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Task cannot be deleted.");
  }
};

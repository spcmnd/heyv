import httpService from "../../services/api.ts";
import type { CreateTaskTemplateInput, TaskTemplate } from "./types/taskTemplate.ts";

const url = "/task-templates";

export const createTaskTemplate = async (input: CreateTaskTemplateInput): Promise<TaskTemplate> => {
  return httpService.post<CreateTaskTemplateInput, TaskTemplate>(`${url}/`, input);
};

export const getTaskTemplate = async (id: number): Promise<TaskTemplate> => {
  return httpService.get<TaskTemplate>(`${url}/${id}/`);
};

export const updateTaskTemplate = async (
  id: number,
  input: CreateTaskTemplateInput,
): Promise<TaskTemplate> => {
  return httpService.patch<CreateTaskTemplateInput, TaskTemplate>(`${url}/${id}/`, input);
};

export const archiveTaskTemplate = async (id: number): Promise<void> => {
  await httpService.post(`${url}/${id}/archive/`);
};

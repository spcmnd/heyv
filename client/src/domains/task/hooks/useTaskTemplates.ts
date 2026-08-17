import { useCallback, useEffect, useState } from "react";
import { getCategories, type Category } from "../categoryService.ts";
import { getRooms, type Room } from "../roomService.ts";
import { createTaskTemplate, getTaskTemplate, updateTaskTemplate } from "../taskTemplateService.ts";
import type { CreateTaskTemplateInput, TaskTemplate } from "../types/taskTemplate.ts";

export const useTaskTemplates = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(true);

  const loadReferences = useCallback(async () => {
    setReferenceLoading(true);

    try {
      const [roomList, categoryList] = await Promise.all([getRooms(), getCategories()]);

      setRooms(roomList);
      setCategories(categoryList);
    } finally {
      setReferenceLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  const create = useCallback(async (input: CreateTaskTemplateInput): Promise<TaskTemplate> => {
    return createTaskTemplate(input);
  }, []);

  const get = useCallback(async (id: number): Promise<TaskTemplate> => {
    return getTaskTemplate(id);
  }, []);

  const update = useCallback(
    async (id: number, input: CreateTaskTemplateInput): Promise<TaskTemplate> => {
      return updateTaskTemplate(id, input);
    },
    [],
  );

  return { rooms, categories, referenceLoading, create, get, update };
};

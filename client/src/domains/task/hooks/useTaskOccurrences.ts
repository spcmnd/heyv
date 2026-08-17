import { useCallback, useEffect, useState } from "react";
import { completeTaskOccurrence, getTaskOccurrences } from "../taskOccurrenceService.ts";
import { archiveTaskTemplate } from "../taskTemplateService.ts";
import type { TaskOccurrence } from "../types/taskOccurrence.ts";

export const useTaskOccurrences = () => {
  const [todos, setTodos] = useState<TaskOccurrence[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const todoOccurrences = await getTaskOccurrences("TODO");

      setTodos(todoOccurrences);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const refresh = useCallback(() => load(true), [load]);

  const reload = useCallback(() => load(false), [load]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const complete = useCallback(
    async (id: number): Promise<TaskOccurrence> => {
      const occurrence = await completeTaskOccurrence(id);

      await load(false);

      return occurrence;
    },
    [load],
  );

  const remove = useCallback(
    async (taskId: number): Promise<void> => {
      await archiveTaskTemplate(taskId);

      await load(false);
    },
    [load],
  );

  return { todos, loading, complete, remove, refresh, reload };
};

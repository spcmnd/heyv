import { useEffect, useState } from "react";
import { completeTaskOccurrence, getTaskOccurrences } from "../taskOccurrenceService.ts";
import { archiveTaskTemplate } from "../taskTemplateService.ts";
import type { TaskOccurrence } from "../types/taskOccurrence.ts";

export const useTaskOccurrences = () => {
  const [todos, setTodos] = useState<TaskOccurrence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getTaskOccurrences({ status: "TODO", limit: 100 });

        if (!cancelled) {
          setTodos(data.results);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    const data = await getTaskOccurrences({ status: "TODO", limit: 100 });
    setTodos(data.results);
  };

  const complete = async (id: number): Promise<TaskOccurrence> => {
    const occurrence = await completeTaskOccurrence(id);

    await refresh();

    return occurrence;
  };

  const remove = async (taskId: number): Promise<void> => {
    await archiveTaskTemplate(taskId);

    await refresh();
  };

  return { todos, loading, complete, remove, refresh };
};

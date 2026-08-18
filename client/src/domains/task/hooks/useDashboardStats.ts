import { useCallback, useEffect, useState } from "react";
import { completeTaskOccurrence, getFilteredTaskOccurrences } from "../taskOccurrenceService.ts";
import type { TaskOccurrence } from "../types/taskOccurrence.ts";
import { startOfDay } from "../utils/dates.ts";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toISODate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

export interface DashboardStats {
  todayCount: number;
  lateCount: number;
  upcomingCount: number;
  recentCompleted: TaskOccurrence[];
  nextTasks: TaskOccurrence[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todayCount: 0,
    lateCount: 0,
    upcomingCount: 0,
    recentCompleted: [],
    nextTasks: [],
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const today = startOfDay(new Date());
      const yesterday = new Date(today.getTime() - DAY_IN_MS);
      const tomorrow = new Date(today.getTime() + DAY_IN_MS);
      const nextWeek = new Date(today.getTime() + 7 * DAY_IN_MS);

      const [todayResult, lateResult, upcomingResult, completedResult, nextTasksResult] =
        await Promise.all([
          getFilteredTaskOccurrences({
            status: "TODO",
            from: toISODate(today),
            to: toISODate(today),
          }),
          getFilteredTaskOccurrences({ status: "TODO", to: toISODate(yesterday) }),
          getFilteredTaskOccurrences({
            status: "TODO",
            from: toISODate(tomorrow),
            to: toISODate(nextWeek),
          }),
          getFilteredTaskOccurrences({ status: "COMPLETED", limit: 5 }),
          getFilteredTaskOccurrences({
            status: "TODO",
            to: toISODate(nextWeek),
            limit: 5,
          }),
        ]);

      setStats({
        todayCount: todayResult.count,
        lateCount: lateResult.count,
        upcomingCount: upcomingResult.count,
        recentCompleted: completedResult.results,
        nextTasks: nextTasksResult.results,
      });
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

  return { stats, loading, complete, refresh, reload };
};

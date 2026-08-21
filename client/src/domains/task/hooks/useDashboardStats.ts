import { useEffect, useState } from "react";
import { completeTaskOccurrence, getTaskOccurrences } from "../taskOccurrenceService.ts";
import type { TaskOccurrence } from "../types/taskOccurrence.ts";
import { startOfDay, toISODate } from "../utils/dates.ts";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface DashboardStats {
  todayCount: number;
  lateCount: number;
  upcomingCount: number;
  recentCompleted: TaskOccurrence[];
  nextTasks: TaskOccurrence[];
}

const fetchStats = async (): Promise<DashboardStats> => {
  const today = startOfDay(new Date());
  const yesterday = new Date(today.getTime() - DAY_IN_MS);
  const tomorrow = new Date(today.getTime() + DAY_IN_MS);
  const nextWeek = new Date(today.getTime() + 7 * DAY_IN_MS);

  const [todayResult, lateResult, upcomingResult, completedResult, nextTasksResult] =
    await Promise.all([
      getTaskOccurrences({
        status: "TODO",
        from: toISODate(today),
        to: toISODate(today),
        limit: 1,
      }),
      getTaskOccurrences({ status: "TODO", to: toISODate(yesterday), limit: 1 }),
      getTaskOccurrences({
        status: "TODO",
        from: toISODate(tomorrow),
        to: toISODate(nextWeek),
        limit: 1,
      }),
      getTaskOccurrences({ status: "COMPLETED", limit: 5 }),
      getTaskOccurrences({
        status: "TODO",
        to: toISODate(nextWeek),
        limit: 5,
      }),
    ]);

  return {
    todayCount: todayResult.count,
    lateCount: lateResult.count,
    upcomingCount: upcomingResult.count,
    recentCompleted: completedResult.results,
    nextTasks: nextTasksResult.results,
  };
};

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todayCount: 0,
    lateCount: 0,
    upcomingCount: 0,
    recentCompleted: [],
    nextTasks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchStats()
      .then((nextStats) => {
        if (!cancelled) {
          setStats(nextStats);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    setStats(await fetchStats());
  };

  const complete = async (id: number): Promise<TaskOccurrence> => {
    const occurrence = await completeTaskOccurrence(id);

    await refresh();

    return occurrence;
  };

  return { stats, loading, complete };
};

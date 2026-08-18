import type { TaskOccurrence } from "../types/taskOccurrence.ts";
import { getDaysDiff } from "./dates.ts";

export type TimeCategoryKey = "LATE" | "TODAY" | "TOMORROW" | "SOON";

export interface TaskOccurrenceGroup {
  key: TimeCategoryKey;
  label: string;
  occurrences: TaskOccurrence[];
}

const TIME_CATEGORY_KEYS: TimeCategoryKey[] = ["LATE", "TODAY", "TOMORROW", "SOON"];

export const TIME_CATEGORY_LABELS: Record<TimeCategoryKey, string> = {
  LATE: "En retard",
  TODAY: "Aujourd'hui",
  TOMORROW: "Demain",
  SOON: "Bientôt",
};

const getTimeCategoryKey = (scheduledFor: string): TimeCategoryKey => {
  const daysDiff = getDaysDiff(new Date(scheduledFor));

  if (daysDiff < 0) {
    return "LATE";
  }

  if (daysDiff === 0) {
    return "TODAY";
  }

  if (daysDiff === 1) {
    return "TOMORROW";
  }

  return "SOON";
};

export const groupTaskOccurrences = (occurrences: TaskOccurrence[]): TaskOccurrenceGroup[] => {
  const grouped = new Map<TimeCategoryKey, TaskOccurrence[]>(
    TIME_CATEGORY_KEYS.map((key) => [key, []]),
  );

  for (const occurrence of occurrences) {
    const key = getTimeCategoryKey(occurrence.scheduled_for);
    grouped.get(key)?.push(occurrence);
  }

  return TIME_CATEGORY_KEYS.map((key) => ({
    key,
    label: TIME_CATEGORY_LABELS[key],
    occurrences: grouped.get(key) ?? [],
  })).filter((group) => group.occurrences.length > 0);
};

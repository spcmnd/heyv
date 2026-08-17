import type { TaskPriority } from "./taskOccurrence.ts";

export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  weekdays: number[];
  day_of_month: number | null;
  week_position: number | null;
  month: number | null;
  start_date: string | null;
  end_date: string | null;
}

export interface TaskTemplate {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  estimated_duration_minutes: number | null;
  is_active: boolean;
  recurrence_rule: RecurrenceRule | null;
  room: string | null;
  category: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export type CreateTaskTemplateInput = {
  title: string;
  description?: string;
  priority: TaskPriority;
  estimated_duration_minutes?: number;
  room?: string;
  category?: string[];
  recurrence_rule?: {
    frequency: RecurrenceFrequency;
    interval: number;
    weekdays?: number[];
    day_of_month?: number;
    week_position?: number;
    month?: number;
    start_date?: string;
    end_date?: string;
  };
};

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskOccurrenceStatus = "TODO" | "COMPLETED" | "SKIPPED" | "CANCELLED";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  room: string | null;
  estimated_duration_minutes: number | null;
  categories: string[];
}

export interface TaskOccurrence {
  id: number;
  scheduled_for: string;
  recurrence_label: string;
  status: TaskOccurrenceStatus;
  task: Task;
  completed_at: string | null;
  completed_by: string | null;
  actual_duration_minutes: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

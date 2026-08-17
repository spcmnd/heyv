import { useState } from "react";
import { Edit01Icon, MoreHorizontal, Trash } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card, Dropdown, Radio, Spin, Tag, type MenuProps } from "antd";
import type { TaskOccurrence, TaskPriority } from "../types/taskOccurrence.ts";

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: "default",
  MEDIUM: "blue",
  HIGH: "red",
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes}`;
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}.${month}.${date.getFullYear()}`;
};

const formatScheduleLabel = (scheduledFor: string): string => {
  const scheduled = new Date(scheduledFor);
  const today = new Date();
  const dateLabel = formatDate(scheduled);

  const daysDiff = Math.round(
    (startOfDay(scheduled).getTime() - startOfDay(today).getTime()) / (24 * 60 * 60 * 1000),
  );

  if (daysDiff < 0) {
    return `${dateLabel} · il y a ${-daysDiff} ${-daysDiff > 1 ? "jours" : "jour"}`;
  }

  if (daysDiff === 0) {
    return `${dateLabel} · aujourd'hui`;
  }

  if (daysDiff === 1) {
    return `${dateLabel} · demain`;
  }

  if (daysDiff < 30) {
    return `${dateLabel} · dans ${daysDiff} jours`;
  }

  return dateLabel;
};

interface TaskCardProps {
  occurrence: TaskOccurrence;
  onComplete: (id: number) => Promise<void>;
  onDelete: (taskId: number) => void;
  onUpdate: (taskId: number) => void;
}

function TaskCard({ occurrence, onComplete, onDelete, onUpdate }: TaskCardProps) {
  const [pending, setPending] = useState(false);
  const { task } = occurrence;
  const completed = occurrence.status === "COMPLETED";

  const handleComplete = async () => {
    if (completed || pending) {
      return;
    }

    setPending(true);

    try {
      await onComplete(occurrence.id);
    } finally {
      setPending(false);
    }
  };

  const scheduleLabel = formatScheduleLabel(occurrence.scheduled_for);

  const menuItems: MenuProps["items"] = [
    {
      key: "update",
      icon: <HugeiconsIcon icon={Edit01Icon} size={18} />,
      label: "Modifier la tâche",
      onClick: () => onUpdate(occurrence.task.id),
    },
    { type: "divider" },
    {
      key: "delete",
      danger: true,
      icon: <HugeiconsIcon icon={Trash} size={18} />,
      label: "Supprimer la tâche",
      onClick: () => onDelete(task.id),
    },
  ];

  return (
    <Card className="w-full! cursor-default! hover:shadow-none!">
      <div className="flex items-start gap-4">
        {pending ? (
          <Spin size="small" className="mt-1" />
        ) : (
          <Radio checked={completed} disabled={completed} onChange={handleComplete} />
        )}

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-base font-medium ${completed ? "text-secondary line-through" : ""}`}
              >
                {task.title}
              </span>

              {task.estimated_duration_minutes !== null && (
                <Tag>{formatDuration(task.estimated_duration_minutes)}</Tag>
              )}
            </div>

            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Button type="text" icon={<HugeiconsIcon icon={MoreHorizontal} size={20} />} />
            </Dropdown>
          </div>

          {task.description && <p className="text-secondary">{task.description}</p>}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Tag color={PRIORITY_COLORS[task.priority]}>{PRIORITY_LABELS[task.priority]}</Tag>

              {task.room && <Tag color="green">{task.room}</Tag>}

              {task.categories.map((category) => (
                <Tag key={category}>{category}</Tag>
              ))}
            </div>

            <Tag color="purple" title={occurrence.recurrence_label ?? undefined}>
              {scheduleLabel}
            </Tag>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TaskCard;

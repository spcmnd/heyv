import { Empty } from "antd";
import TaskCard from "./TaskCard.tsx";
import type { TaskOccurrenceGroup } from "../utils/timeCategories.ts";

interface TaskGroupProps {
  group: TaskOccurrenceGroup;
  onComplete: (id: number) => Promise<void>;
  onDelete: (taskId: number) => void;
  onUpdate: (taskId: number) => void;
}

function TaskGroup({ group, onComplete, onDelete, onUpdate }: TaskGroupProps) {
  if (group.occurrences.length === 0) {
    return <Empty description="Aucune tâche" />;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-medium">{group.label}</h2>

      {group.occurrences.map((occurrence) => (
        <TaskCard
          key={occurrence.id}
          occurrence={occurrence}
          onComplete={onComplete}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </section>
  );
}

export default TaskGroup;

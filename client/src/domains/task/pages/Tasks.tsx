import { useState } from "react";
import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { App, Button, Empty, Spin } from "antd";
import CreateTaskTemplateModal from "../components/CreateTaskTemplateModal.tsx";
import TaskGroup from "../components/TaskGroup.tsx";
import { useTaskOccurrences } from "../hooks/useTaskOccurrences.ts";
import { groupTaskOccurrences } from "../utils/timeCategories.ts";
import type { TaskOccurrenceGroup } from "../utils/timeCategories.ts";

function Tasks() {
  const { message, modal } = App.useApp();
  const { todos, loading, complete, remove, refresh } = useTaskOccurrences();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const todoGroups = groupTaskOccurrences(todos);

  const handleComplete = async (id: number) => {
    try {
      await complete(id);
      message.success("Tâche terminée !");
    } catch {
      message.error("Impossible de terminer la tâche.");
    }
  };

  const handleDelete = (taskId: number) => {
    modal.confirm({
      title: "Supprimer la tâche ?",
      content:
        "Cette action supprimera cette tâche ainsi que toutes les occurrences suivantes. Elle est irréversible.",
      okText: "Supprimer",
      okButtonProps: { danger: true },
      cancelText: "Annuler",
      onOk: async () => {
        try {
          await remove(taskId);
          message.success("Tâche supprimée.");
        } catch {
          message.error("Impossible de supprimer la tâche.");
          throw new Error("Task cannot be deleted.");
        }
      },
    });
  };

  const handleEdit = (taskId: number) => {
    setEditingTaskId(taskId);
  };

  const handleModalClose = () => {
    setCreateOpen(false);
    setEditingTaskId(null);
  };

  const renderGroups = (groups: TaskOccurrenceGroup[], emptyText: string) => {
    if (loading) {
      return (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      );
    }

    if (groups.length === 0) {
      return <Empty description={emptyText} />;
    }

    return (
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <TaskGroup
            key={group.key}
            group={group}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onUpdate={handleEdit}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex gap-4 flex-col">
          <h1 className="text-3xl sm:text-4xl font-medium">Tâches</h1>
        </div>
        <div className="flex gap-8 items-center">
          <Button
            type="primary"
            size="large"
            icon={<HugeiconsIcon icon={Plus} size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Ajouter
          </Button>
        </div>
      </header>

      <CreateTaskTemplateModal
        open={createOpen || editingTaskId !== null}
        taskId={editingTaskId}
        onSuccess={() => refresh()}
        onClose={handleModalClose}
      />

      <div className="mt-4">{renderGroups(todoGroups, "Aucune tâche à faire. Profitez-en !")}</div>
    </>
  );
}

export default Tasks;

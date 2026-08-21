import { useState } from "react";
import { App, Card, Checkbox, Listy, Skeleton, Spin, Statistic, Tag } from "antd";
import { useDashboardStats } from "../hooks/useDashboardStats.ts";
import { formatDateLabel, isLate } from "../utils/dates.ts";

function DashboardStats() {
  const { message } = App.useApp();
  const { stats, loading, complete } = useDashboardStats();
  const [pendingId, setPendingId] = useState<number | null>(null);

  const handleComplete = async (id: number) => {
    if (pendingId !== null) {
      return;
    }

    setPendingId(id);

    try {
      await complete(id);
      message.success("Tâche terminée !");
    } catch {
      message.error("Impossible de terminer la tâche.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <Statistic title="Tâches du jour" value={stats.todayCount} loading={loading} />

          {!loading &&
            (stats.lateCount > 0 ? (
              <p className="mt-2 text-error-dark">{stats.lateCount} en retard</p>
            ) : (
              <p className="mt-2 text-secondary">Aucune tâche en retard</p>
            ))}
        </Card>

        <Card>
          <Statistic title="À venir cette semaine" value={stats.upcomingCount} loading={loading} />
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Dernières tâches terminées">
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : stats.recentCompleted.length === 0 ? (
            <p className="text-secondary">Aucune tâche terminée.</p>
          ) : (
            <Listy
              items={stats.recentCompleted}
              rowKey="id"
              itemRender={(occurrence) => (
                <div className="flex items-center justify-between gap-2 py-2">
                  <span className="min-w-0 truncate">{occurrence.task.title}</span>
                  <Tag color="green">
                    {formatDateLabel(occurrence.completed_at ?? occurrence.scheduled_for)}
                  </Tag>
                </div>
              )}
            />
          )}
        </Card>

        <Card title="Prochaines tâches">
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : stats.nextTasks.length === 0 ? (
            <p className="text-secondary">Aucune tâche à venir.</p>
          ) : (
            <Listy
              items={stats.nextTasks}
              rowKey="id"
              itemRender={(occurrence) => {
                const late = isLate(occurrence.scheduled_for);

                return (
                  <div className="flex items-center justify-between gap-2 py-2">
                    {pendingId === occurrence.id ? (
                      <Spin size="small" />
                    ) : (
                      <Checkbox onChange={() => handleComplete(occurrence.id)} />
                    )}
                    <span className={`min-w-0 flex-1 truncate ${late ? "text-error-dark" : ""}`}>
                      {occurrence.task.title}
                    </span>
                    <Tag color={late ? "red" : "purple"}>
                      {late ? "En retard" : formatDateLabel(occurrence.scheduled_for)}
                    </Tag>
                  </div>
                );
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default DashboardStats;

import { useState } from "react";
import { Badge, Button } from "antd";
import { useAuth } from "../providers/AuthProvider";
import { Notification, Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CreateTaskTemplateModal from "../domains/task/components/CreateTaskTemplateModal.tsx";

function Dashboard() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <header className="flex flex-col gap-4 items-start sm:flex-row sm:justify-between sm:items-start">
        <div className="flex gap-4 flex-col">
          <h1 className="text-3xl sm:text-4xl font-medium">Bonjour {user?.firstName} 👋</h1>
          <p className="text-secondary">Voici ce qui se passe aujourd'hui dans notre maison.</p>
        </div>
        <div className="flex gap-8 items-center self-end sm:self-auto">
          <Button
            type="primary"
            size="large"
            icon={<HugeiconsIcon icon={Plus} size={16} />}
            onClick={() => setCreateOpen(true)}
          >
            Ajouter
          </Button>

          <Button
            type="text"
            icon={
              <Badge count={2}>
                <HugeiconsIcon icon={Notification} size={24} />
              </Badge>
            }
          ></Button>
        </div>
      </header>

      <CreateTaskTemplateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}

export default Dashboard;

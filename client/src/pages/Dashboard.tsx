import { Badge, Button } from "antd";
import { useAuth } from "../providers/AuthProvider";
import { Notification, Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <header className="flex justify-between gap-4 items-start">
        <div className="flex gap-4 flex-col">
          <h1 className="text-4xl font-medium">Bonjour {user?.firstName} 👋</h1>
          <p className="text-secondary">
            Voici ce qui se passe aujourd'hui dans notre maison.
          </p>
        </div>
        <div className="flex gap-8 items-center">
          <Button
            type="primary"
            size="large"
            icon={<HugeiconsIcon icon={Plus} size={16} />}
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
    </>
  );
}

export default Dashboard;

import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";

function Tasks() {
  return (
    <>
      <header className="flex justify-between gap-4">
        <div className="flex gap-4 flex-col">
          <h1 className="text-4xl font-medium">Tâches</h1>
        </div>
        <div className="flex gap-8 items-center">
          <Button
            type="primary"
            size="large"
            icon={<HugeiconsIcon icon={Plus} size={16} />}
          >
            Ajouter
          </Button>
        </div>
      </header>
    </>
  );
}

export default Tasks;

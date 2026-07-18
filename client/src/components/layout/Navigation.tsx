import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ClipboardListIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { label: "Dashboard", icon: DashboardSquare01Icon },
  { label: "Tâches", icon: ClipboardListIcon },
  { label: "Paramètres", icon: Settings01Icon },
];

function Navigation() {
  const [active, setActive] = useState("Dashboard");

  return (
    <nav className="mt-8 space-y-2">
      {navItems.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => setActive(label)}
          className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg text-md font-medium transition-colors hover:cursor-pointer ${
            active === label
              ? "bg-primary-light"
              : "text-secondary hover:bg-surface-hover hover:text-primary"
          }`}
        >
          <HugeiconsIcon icon={Icon} size={24} className={active === label ? "text-brand" : ""} />
          {label}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;

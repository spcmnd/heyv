import { LayoutDashboard, ClipboardList, Settings } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Tâches", icon: ClipboardList },
  { label: "Paramètres", icon: Settings },
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
          <Icon size={24} className={active === label ? "text-brand" : ""} />
          {label}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
